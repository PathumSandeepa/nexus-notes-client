import type { Note } from "../types/note";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const formattedDate = new Date(note.created_at).toLocaleDateString();

  return (
    <Card className="flex flex-col h-full bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1">{note.title}</CardTitle>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formattedDate}
          </span>
        </div>
        <CardDescription className="line-clamp-3 mt-2 min-h-[4.5rem]">
          {note.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {note.file && (
          <a href={note.file} target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Attachment
            </Badge>
          </a>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
