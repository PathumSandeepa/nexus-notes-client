import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { NoteList } from "../components/NoteList";
import { NoteForm } from "../components/NoteForm";
import { DeleteDialog } from "../components/DeleteDialog";
import type { Note } from "../types/note";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const { notes, loading, error, createNote, updateNote, deleteNote, uploadFile } = useNotes();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload: Partial<Note>) => {
    if (editingNote) {
      const res = await updateNote(editingNote.id, payload);
      return !!res;
    }
    const res = await createNote(payload);
    return !!res;
  };

  const handleOpenDelete = (id: string) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    const success = await deleteNote(noteToDelete);
    if (success) {
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Nexus Notes</h1>
          <Button onClick={handleOpenCreate}>New Note</Button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        <main>
          <NoteList
            notes={notes}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        </main>
      </div>

      <NoteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        uploadFile={uploadFile}
        initialData={editingNote}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
