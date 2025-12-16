import React from 'react';
import { Mood, Importance, Difficulty } from '../types';

interface StickyNoteProps {
  id: string;
  text: string;
  mood: Mood;
  importance: Importance;
  keywords: string[];
  difficulty: Difficulty;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

const moodColors: Record<Mood, string> = {
  [Mood.CONFUSED]: 'bg-mood-confused border-yellow-200 text-yellow-900 dark:bg-darkmood-confused dark:border-yellow-900 dark:text-yellow-100',
  [Mood.CONFIDENT]: 'bg-mood-confident border-green-200 text-green-900 dark:bg-darkmood-confident dark:border-green-900 dark:text-green-100',
  [Mood.BORED]: 'bg-mood-bored border-slate-300 text-slate-700 dark:bg-darkmood-bored dark:border-slate-700 dark:text-slate-300',
  [Mood.ALERT]: 'bg-mood-alert border-red-200 text-red-900 dark:bg-darkmood-alert dark:border-red-900 dark:text-red-100',
};

const moodLabels: Record<Mood, string> = {
  [Mood.CONFUSED]: 'Confused',
  [Mood.CONFIDENT]: 'Confident',
  [Mood.BORED]: 'Bored',
  [Mood.ALERT]: 'Alert',
};

// Doodles
const DoodleIcon: React.FC<{ mood: Mood }> = ({ mood }) => {
    if (mood === Mood.CONFUSED) {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 rotate-12">
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
            </svg>
        )
    }
    if (mood === Mood.CONFIDENT) {
        return (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 -rotate-6">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        )
    }
    if (mood === Mood.BORED) {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                <path d="M4 12h16" />
                <path d="M4 18h10" />
            </svg>
        )
    }
    return ( // Alert
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 -rotate-12">
            <path d="M12 2v16" />
            <path d="M12 22h.01" />
        </svg>
    )
}

const getRandomRotation = (index: number) => {
  const seed = index * 1337; 
  const deg = (seed % 3) - 1.5; 
  return `rotate(${deg}deg)`;
};

const HighlightedText: React.FC<{ text: string; keywords: string[] }> = ({ text, keywords }) => {
    if (!keywords || keywords.length === 0) return <span>{text}</span>;
    
    // Create a regex from keywords, sorting by length to match longest first
    const regex = new RegExp(`(${keywords.slice().sort((a,b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    
    const parts = text.split(regex);
    
    return (
        <span>
            {parts.map((part, i) => 
                regex.test(part) ? <span key={i} className="keyword-highlight">{part}</span> : part
            )}
        </span>
    );
};

export const StickyNote: React.FC<StickyNoteProps> = ({ 
    id, text, mood, importance, keywords, difficulty, index, onDragStart, onDragOver, onDrop 
}) => {
  const rotation = React.useMemo(() => getRandomRotation(index), [index]);
  
  const difficultyColors: Record<Difficulty, string> = {
    'Beginner': 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    'Advanced': 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
  };
  
  return (
    <div 
      id={id}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`
        relative p-4 mb-6 shadow-md rounded-sm border-b-2 cursor-grab active:cursor-grabbing
        ${moodColors[mood]}
        transition-all duration-300 ease-out
        hover:scale-[1.01] hover:shadow-lg hover:-translate-y-1
        font-hand text-lg leading-relaxed
        opacity-0 animate-slide-up-fade group
      `}
      style={{ 
        transform: rotation,
        animationDelay: `${Math.min(index * 50, 500)}ms` 
      }}
    >
      {/* Tape Graphic */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-tape-translucent backdrop-blur-[1px] shadow-sm transform -rotate-1 skew-x-12 opacity-80 pointer-events-none" />
      
      {/* Drag Handle (Visual hint) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      </div>

      {/* Mood Header */}
      <div className="flex justify-between items-start mb-2 border-b border-black/10 dark:border-white/10 pb-1">
        <div className="flex items-center gap-2">
            <DoodleIcon mood={mood} />
            <span className={`uppercase tracking-widest text-xs font-bold font-marker opacity-80`}>
                {moodLabels[mood]}
            </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Difficulty Badge */}
          <div className={`
            text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 transform -rotate-3
            ${difficultyColors[difficulty]}
          `}>
            {difficulty}
          </div>
          
          {/* Importance Stamp */}
          <div className={`
               text-[10px] font-bold uppercase tracking-wider border-2 rounded px-1 transform rotate-6 opacity-70
               ${importance === 'High' ? 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400' : 
                 importance === 'Medium' ? 'border-orange-500 text-orange-500' : 'border-gray-500 text-gray-500'}
          `}>
              {importance}
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="whitespace-pre-wrap mb-3">
         <HighlightedText text={text} keywords={keywords} />
      </p>

      {/* Keywords Footer */}
      {keywords && keywords.length > 0 && (
          <div className="text-sm opacity-60 font-sans italic">
             <span className="font-semibold not-italic">Key terms:</span> {keywords.join(', ')}
          </div>
      )}
    </div>
  );
};