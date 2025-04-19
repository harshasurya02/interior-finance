"use client";
import { Button } from "../ui/button";
import { Download, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AttachmentsList({
  attachments = [],
  onDelete,
}: {
  attachments: any[];
  onDelete?: (id: string) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Attachments</h3>
      {attachments.length === 0 ? (
        <p className="text-sm text-gray-500">No attachments yet</p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.attachment_id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <span>{attachment.attachment_name}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.attachment_url, "_blank")}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attachment.attachment_id)}
                    disabled={deletingId === attachment.attachment_id}
                  >
                    {deletingId === attachment.attachment_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}