import React, { useState, useRef, useEffect } from 'react';
import { SimpleNote } from '../types';

interface NoteTabsProps {
  notes: SimpleNote[];
  activeNoteId: string;
  onSwitch: (id: string) => void;
  onNew: () => void;
  onClose: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export const NoteTabs: React.FC<NoteTabsProps> = ({
  notes,
  activeNoteId,
  onSwitch,
  onNew,
  onClose,
  onRename,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleDoubleClick = (note: SimpleNote) => {
    setEditingId(note.id);
    setEditValue(note.title);
  };

  const handleRename = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleCloseTab = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    const note = notes.find(n => n.id === noteId);
    
    if (notes.length === 1) {
      alert('Cannot close the last note!');
      return;
    }

    if (note?.analysis) {
      if (confirm(`Close "${note.title}"? The analysis will be lost.`)) {
        onClose(noteId);
      }
    } else {
      onClose(noteId);
    }
  };

  const canAddMore = notes.length < 10;

  return (
    <div className="border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 flex items-end overflow-x-auto select-none">
      <div className="flex gap-1 min-w-0 flex-1">
        {notes.map((note) => {
          const isActive = note.id === activeNoteId;
          
          return (
            <div
              key={note.id}
              onClick={() => onSwitch(note.id)}
              className={`
                group relative px-4 py-2 cursor-pointer transition-all flex items-center gap-2 min-w-[120px] max-w-[200px]
                ${isActive 
                  ? 'bg-white dark:bg-gray-800 border-t-2 border-x-2 border-blue-500 -mb-[2px] z-10' 
                  : 'bg-gray-100 dark:bg-gray-800/50 border-t border-x border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                }
                rounded-t-md
              `}
            >
              {/* Note Icon */}
              <span className="text-sm flex-shrink-0">📝</span>

              {/* Title - Editable */}
              {editingId === note.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none font-hand text-sm px-1 text-gray-800 dark:text-gray-200"
                  maxLength={30}
                />
              ) : (
                <span
                  onDoubleClick={() => handleDoubleClick(note)}
                  className={`
                    flex-1 min-w-0 truncate font-hand text-sm
                    ${isActive ? 'text-gray-800 dark:text-gray-200 font-semibold' : 'text-gray-600 dark:text-gray-400'}
                  `}
                  title={note.title}
                >
                  {note.title}
                </span>
              )}

              {/* Close Button */}
              {notes.length > 1 && (
                <button
                  onClick={(e) => handleCloseTab(e, note.id)}
                  className="flex-shrink-0 w-4 h-4 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Close tab"
                >
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M11 1L1 11M1 1l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* New Tab Button */}
      <button
        onClick={onNew}
        disabled={!canAddMore}
        className={`
          flex-shrink-0 px-3 py-2 mb-[2px] font-hand text-sm rounded-t-md transition-all
          ${canAddMore
            ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }
        `}
        title={canAddMore ? 'New note (max 10)' : 'Maximum 10 notes reached'}
      >
        + New
      </button>
    </div>
  );
};
