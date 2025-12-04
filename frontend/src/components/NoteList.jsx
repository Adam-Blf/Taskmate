import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchNotes, deleteNote } from '../api/notes';
import NoteForm from './NoteForm';

export default function NoteList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const queryClient = useQueryClient();

  const { data: notes, isLoading, error } = useQuery(['notes'], fetchNotes);

  const deleteMutation = useMutation(deleteNote, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    }
  });

  if (isLoading) return <div className="p-4">Loading notes...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading notes</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
        <button
          onClick={() => {
            setEditingNote(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes?.map((note) => (
          <div key={note._id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col h-64">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{note.title}</h3>
              {note.project && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded max-w-[100px] truncate">
                  {note.project.title}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden relative">
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-50">
              <span className="text-xs text-gray-400">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingNote(note);
                    setIsFormOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this note?')) {
                      deleteMutation.mutate(note._id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {notes?.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No notes found. Create one to capture your thoughts!
          </div>
        )}
      </div>

      {isFormOpen && (
        <NoteForm
          note={editingNote}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
