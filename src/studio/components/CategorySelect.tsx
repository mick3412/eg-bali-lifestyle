"use client";

/**
 * 分類多選核取方塊元件（產品 & 文章共用）
 * 從 Sanity `categorySettings` 文件即時讀取分類列表
 */
import React, { useEffect, useState, useCallback } from "react";
import { ArrayOfPrimitivesInputProps, set, unset, useClient } from "sanity";

interface CategoryItem {
    name: string;
}

interface CategorySelectProps extends ArrayOfPrimitivesInputProps<string> {
    categoryType: "product" | "article";
}

function CategorySelect(props: CategorySelectProps) {
    const { categoryType, value = [], onChange, readOnly } = props;
    const client = useClient({ apiVersion: "2024-01-01" });
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const field = categoryType === "product" ? "productCategories" : "articleCategories";

    useEffect(() => {
        setLoading(true);
        client
            .fetch<CategoryItem[]>(
                `*[_type == "categorySettings"][0].${field}[]{name}`
            )
            .then((list) => {
                setCategories(list ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [client, field]);

    const handleToggle = useCallback(
        (catName: string) => {
            if (readOnly) return;
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(catName)
                ? currentValues.filter((v) => v !== catName)
                : [...currentValues, catName];

            onChange(newValues.length > 0 ? set(newValues) : unset());
        },
        [value, readOnly, onChange]
    );

    if (loading) {
        return (
            <div style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>
                載入分類中...
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div
                style={{
                    padding: "10px 12px",
                    background: "rgba(255,200,0,0.08)",
                    border: "1px solid rgba(255,200,0,0.3)",
                    borderRadius: 4,
                    color: "#ccc",
                    fontSize: 13,
                }}
            >
                尚未在「分類設定」建立任何分類。請先新增分類後再回來勾選。
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((cat) => {
                const isChecked = Array.isArray(value) && value.includes(cat.name);
                return (
                    <label
                        key={cat.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: readOnly ? "default" : "pointer",
                            opacity: readOnly ? 0.6 : 1,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={readOnly}
                            onChange={() => handleToggle(cat.name)}
                            style={{
                                width: 16,
                                height: 16,
                                cursor: readOnly ? "default" : "pointer",
                            }}
                        />
                        <span style={{ fontSize: 14 }}>{cat.name}</span>
                    </label>
                );
            })}
        </div>
    );
}

export function ProductCategorySelect(props: ArrayOfPrimitivesInputProps<string | number | boolean>) {
    return <CategorySelect {...(props as CategorySelectProps)} categoryType="product" />;
}

export function ArticleCategorySelect(props: ArrayOfPrimitivesInputProps<string | number | boolean>) {
    return <CategorySelect {...(props as CategorySelectProps)} categoryType="article" />;
}
