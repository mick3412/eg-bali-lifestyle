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

// ─── SubcategorySelect ─────────────────────────────────────────────────────

interface SubcategoryItem { name: string; }
interface ParentCategoryItem { name: string; subcategories?: SubcategoryItem[]; }

function ProductSubcategorySelectInner(props: ArrayOfPrimitivesInputProps<string | number | boolean>) {
    const { value = [], onChange, readOnly } = props as ArrayOfPrimitivesInputProps<string>;
    const client = useClient({ apiVersion: "2024-01-01" });
    // Read the selected main categories from the parent product document
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { useFormValue } = require("sanity") as { useFormValue: (path: string[]) => any };
    const selectedMainCats: string[] = (useFormValue(["category"]) as string[]) ?? [];

    const [allParentCats, setAllParentCats] = useState<ParentCategoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        client
            .fetch<ParentCategoryItem[]>(
                `*[_type == "categorySettings"][0].productCategories[]{ name, subcategories[]{ name } }`
            )
            .then((list) => {
                setAllParentCats(list ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [client]);

    const availableSubs = allParentCats
        .filter((p) => selectedMainCats.includes(p.name))
        .flatMap((p) => p.subcategories ?? []);

    const handleToggle = useCallback(
        (subName: string) => {
            if (readOnly) return;
            const current = Array.isArray(value) ? (value as string[]) : [];
            const next = current.includes(subName)
                ? current.filter((v) => v !== subName)
                : [...current, subName];
            onChange(next.length > 0 ? set(next) : unset());
        },
        [value, readOnly, onChange]
    );

    if (loading) {
        return <div style={{ padding: "8px 12px", color: "#888", fontSize: 13 }}>載入子分類中...</div>;
    }

    if (selectedMainCats.length === 0) {
        return (
            <div style={{ padding: "10px 12px", background: "rgba(0,100,255,0.06)", border: "1px solid rgba(0,100,255,0.2)", borderRadius: 4, color: "#aaa", fontSize: 13 }}>
                請先選擇「主分類」，才能設定子分類。
            </div>
        );
    }

    if (availableSubs.length === 0) {
        return (
            <div style={{ padding: "10px 12px", background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.3)", borderRadius: 4, color: "#ccc", fontSize: 13 }}>
                所選主分類尚未設定子分類。請至「分類設定」新增子分類。
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {availableSubs.map((sub) => {
                const isChecked = Array.isArray(value) && (value as string[]).includes(sub.name);
                return (
                    <label
                        key={sub.name}
                        style={{ display: "flex", alignItems: "center", gap: 8, cursor: readOnly ? "default" : "pointer", opacity: readOnly ? 0.6 : 1 }}
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={readOnly}
                            onChange={() => handleToggle(sub.name)}
                            style={{ width: 16, height: 16, cursor: readOnly ? "default" : "pointer" }}
                        />
                        <span style={{ fontSize: 14 }}>{sub.name}</span>
                    </label>
                );
            })}
        </div>
    );
}

export function ProductSubcategorySelect(props: ArrayOfPrimitivesInputProps<string | number | boolean>) {
    return <ProductSubcategorySelectInner {...props} />;
}
