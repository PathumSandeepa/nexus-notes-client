import type { Note } from "../types/note";
import { NoteCard } from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteList = ({ notes, loading, onEdit, onDelete }: NoteListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-xl bg-card animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed">
        <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
        <p className="text-muted-foreground">Create your first note to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};
