import React, { useState } from 'react';
import { Mood, ParagraphAnalysis } from '../types';

interface TimelineProps {
    paragraphs: ParagraphAnalysis[];
    onParagraphClick: (id: string) => void;
}

const moodColors: Record<Mood, string> = {
    [Mood.CONFUSED]: 'bg-yellow-300 dark:bg-yellow-700',
    [Mood.CONFIDENT]: 'bg-green-300 dark:bg-green-700',
    [Mood.BORED]: 'bg-slate-300 dark:bg-slate-600',
    [Mood.ALERT]: 'bg-red-300 dark:bg-red-700',
};

export const Timeline: React.FC<TimelineProps> = ({ paragraphs, onParagraphClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Heatmap Logic: Divide into 4 chunks
    const chunks = 4;
    const chunkSize = Math.ceil(paragraphs.length / chunks);
    const heatMapData = Array.from({ length: chunks }).map((_, i) => {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, paragraphs.length);
        const segment = paragraphs.slice(start, end);
        const confusedCount = segment.filter(p => p.mood === Mood.CONFUSED).length;
        const intensity = segment.length > 0 ? confusedCount / segment.length : 0;
        return intensity;
    });

    return (
        <div className="mb-6 space-y-2 select-none">
            {/* Timeline Strip */}
            <div className="flex w-full h-8 rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm relative">
                {paragraphs.map((p, idx) => (
                    <div
                        key={p.id}
                        className={`flex-1 ${moodColors[p.mood]} cursor-pointer hover:brightness-95 transition-all relative group`}
                        onClick={() => onParagraphClick(p.id)}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                         {/* Hover Tooltip - Positioned fixed/absolute relative to strip container could be tricky, 
                             so we put it inside but translate it. */}
                         {hoveredIndex === idx && (
                             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded p-2 z-50 pointer-events-none shadow-xl font-sans">
                                 <div className="font-bold mb-1">Paragraph {idx + 1} • <span className="uppercase">{p.mood}</span></div>
                                 <div className="truncate opacity-80 italic">"{p.text.substring(0, 40)}..."</div>
                                 {/* Triangle arrow */}
                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                             </div>
                         )}
                    </div>
                ))}
            </div>

            {/* Confusion Heatmap */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 w-24 text-right">Confusion Hotspots</span>
                <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {heatMapData.map((intensity, idx) => (
                        <div 
                            key={idx} 
                            className="flex-1 transition-colors duration-500"
                            style={{ 
                                backgroundColor: `rgba(234, 179, 8, ${0.1 + (intensity * 0.9)})` // Yellow scale
                            }}
                            title={`Section ${idx+1}: ${Math.round(intensity * 100)}% Confused`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};