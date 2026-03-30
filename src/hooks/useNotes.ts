import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import type { Note } from "../types/note";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.get("/api/notes/");
      setNotes(response.data?.data || []);
    } catch (error) {
      const err = error as any;
      setError(err.response?.data?.message || err.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (payload: Partial<Note>): Promise<Note | null> => {
    try {
      const response = await api.post("/api/notes/", payload);
      const newNote = response.data?.data;
      if (!newNote) return null;
      
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      const err = error as any;
      setError(err.response?.data?.message || err.message || "Failed to create note");
      return null;
    }
  };

  const updateNote = async (id: string, payload: Partial<Note>): Promise<Note | null> => {
    try {
      const response = await api.put(`/api/notes/${id}/`, payload);
      const updatedNote = response.data?.data;
      if (!updatedNote) return null;

      setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
      return updatedNote;
    } catch (error) {
      const err = error as any;
      setError(err.response?.data?.message || err.message || "Failed to update note");
      return null;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/notes/${id}/`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return true;
    } catch (error) {
      const err = error as any;
      setError(err.response?.data?.message || err.message || "Failed to delete note");
      return false;
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/api/notes/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data?.url || null;
    } catch (error) {
      const err = error as any;
      setError(err.response?.data?.message || err.message || "Failed to upload file");
      return null;
    }
  };

  return { notes, loading, error, createNote, updateNote, deleteNote, uploadFile };
};

