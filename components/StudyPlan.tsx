import React from 'react';
import { StudyPlan as StudyPlanType, ParagraphAnalysis } from '../types';

interface StudyPlanProps {
    plan: StudyPlanType;
    paragraphs: ParagraphAnalysis[];
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ plan, paragraphs }) => {
    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-sm transform -rotate-1 font-hand text-gray-800 dark:text-gray-200 relative">
            {/* Paper clip visual */}
            <div className="absolute -top-3 right-8 w-4 h-12 border-2 border-gray-400 rounded-full z-10 bg-transparent pointer-events-none" />
            
            <h3 className="font-marker text-lg text-blue-600 dark:text-blue-300 mb-3 border-b border-blue-100 dark:border-gray-500 pb-1">
                Study Plan for this Lecture
            </h3>
            
            <div className="space-y-3 text-sm leading-6">
                {/* Confused Areas */}
                {plan.topConfusedIndices.length > 0 && (
                    <div>
                        <strong className="text-red-600 dark:text-red-300">Focus on:</strong>
                        <ul className="list-disc pl-5 mt-1 opacity-90">
                            {plan.topConfusedIndices.map(idx => {
                                const p = paragraphs[idx];
                                return p ? (
                                    <li key={idx}>
                                        <span className="font-bold">Para {idx + 1}:</span> {p.text.substring(0, 50)}...
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </div>
                )}

                {/* Confident Areas */}
                {plan.topConfidentIndices.length > 0 && (
                     <div>
                        <strong className="text-green-600 dark:text-green-300">Things you understand well:</strong>
                        <ul className="list-disc pl-5 mt-1 opacity-90">
                            {plan.topConfidentIndices.map(idx => {
                                const p = paragraphs[idx];
                                return p ? (
                                    <li key={idx}>
                                        Para {idx + 1} ({p.keywords[0] || 'General'})
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </div>
                )}
                
                {/* Suggestion */}
                {plan.suggestion && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-gray-800 border-l-4 border-yellow-400 italic text-gray-600 dark:text-gray-300">
                        "AI Tip: {plan.suggestion}"
                    </div>
                )}
            </div>
        </div>
    );
};