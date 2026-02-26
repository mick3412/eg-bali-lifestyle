"use client";

/**
 * 分類下拉選單元件（產品 & 文章共用）
 * 從 Sanity `categorySettings` 文件即時讀取分類列表
 */
import React, { useEffect, useState } from "react";
import { StringInputProps, set, useClient } from "sanity";

interface CategoryItem {
    name: string;
}

interface CategorySelectProps extends StringInputProps {
    categoryType: "product" | "article";
}

function CategorySelect({ categoryType, value, onChange, readOnly }: CategorySelectProps) {
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
                尚未在「分類設定」建立任何分類。請先新增分類後再回來選擇。
            </div>
        );
    }

    return (
        <select
            value={value ?? ""}
            disabled={readOnly}
            onChange={(e) => onChange(set(e.target.value))}
            style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "inherit",
                fontSize: 14,
                cursor: readOnly ? "not-allowed" : "pointer",
            }}
        >
            <option value="">— 請選擇分類 —</option>
            {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                    {cat.name}
                </option>
            ))}
        </select>
    );
}

export function ProductCategorySelect(props: StringInputProps) {
    return <CategorySelect {...props} categoryType="product" />;
}

export function ArticleCategorySelect(props: StringInputProps) {
    return <CategorySelect {...props} categoryType="article" />;
}
