"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { uploadAttachment } from "@/lib/actions/attachment";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AttachmentDialog({
  isOpen,
  onClose,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}) {
  const [attachmentName, setAttachmentName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadAttachment(file, attachmentName, projectId);
      router.refresh(); // Refresh the page to show new attachment
      setAttachmentName("");
      setFile(null);
      onClose();
    } catch (error) {
      console.error("Error uploading attachment:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isUploading ? undefined : onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Attachment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="my-2">
            <Label htmlFor="attachmentName" className="my-2">Attachment Name</Label>
            <Input
              id="attachmentName"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              placeholder="Enter attachment name"
              required
            />
          </div>
          <div className="my-2">
            <Label htmlFor="file" className="my-2">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Upload Attachment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}