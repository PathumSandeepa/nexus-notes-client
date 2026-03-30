import { useState, useEffect } from "react";
import type { Note } from "../types/note";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: Partial<Note>) => Promise<boolean>;
  uploadFile: (file: File) => Promise<string | null>;
  initialData?: Note | null;
}

export const NoteForm = ({ isOpen, onClose, onSubmit, uploadFile, initialData }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setFile(null);
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    let fileUrl = initialData?.file || null;

    if (file) {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl) {
        fileUrl = uploadedUrl;
      }
    }

    const payload: Partial<Note> = {
        title: title.trim(),
        description: description.trim(),
        file: fileUrl,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update your note details below." : "Add a new note with an optional attachment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter note details"
              disabled={loading}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Attachment (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            {initialData?.file && !file && (
              <p className="text-xs text-muted-foreground mt-1">Current file will be retained if no new file is selected.</p>
            )}
          </div>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
