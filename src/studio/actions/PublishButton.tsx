"use client";

import { useDocumentOperation, getPublishedId } from "sanity";

/**
 * 自訂「發布」按鈕，確保在文件編輯器底部顯示
 */
export function PublishButton(props: { id: string; type: string; draft?: unknown; published?: unknown; onComplete?: () => void }) {
  const publishedId = getPublishedId(props.id);
  const { publish } = useDocumentOperation(publishedId, props.type);
  const hasDraft = Boolean(props.draft);
  const isPublished = Boolean(props.published) && !hasDraft;

  if (isPublished) {
    return null;
  }

  return {
    label: "發布",
    tone: "primary" as const,
    shortcut: "mod+enter",
    group: ["default" as const],
    disabled: Boolean(publish.disabled),
    onHandle: () => {
      publish.execute();
      props.onComplete?.();
    },
  };
}
