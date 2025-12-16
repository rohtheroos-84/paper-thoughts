import React from 'react';

interface NoteSummaryProps {
  tldr: string;
}

export const NoteSummary: React.FC<NoteSummaryProps> = ({ tldr }) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg shadow-sm">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="font-marker text-sm uppercase tracking-wide text-blue-700 dark:text-blue-300 mb-1">
            TL;DR Summary
          </h3>
          <p className="font-hand text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {tldr}
          </p>
        </div>
      </div>
    </div>
  );
};
