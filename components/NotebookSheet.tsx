import React from 'react';

interface NotebookSheetProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerColor?: string;
}

export const NotebookSheet: React.FC<NotebookSheetProps> = ({ children, className = '', title, headerColor = 'bg-yellow-200' }) => {
  return (
    <div className={`relative bg-white dark:bg-gray-800 shadow-sm h-full flex flex-col overflow-hidden transition-colors duration-300 ${className}`}>
      {/* Top Binding Holes (Visual only) */}
      <div className="absolute top-0 left-0 w-full h-8 z-10 flex justify-evenly items-center pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-black/40 dark:bg-white/20" />
        ))}
      </div>

      {/* Paper Texture CSS */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-100 dark:opacity-10"
           style={{
             backgroundImage: `
               linear-gradient(transparent 95%, #a3c2c2 95%),
               linear-gradient(90deg, transparent 90px, #ff9999 90px, transparent 92px)
             `,
             backgroundSize: '100% 2rem, 100% 100%',
             backgroundAttachment: 'local'
           }}
      />
      {/* Dark Mode Lines (Simulated via separate div for better control) */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden dark:block opacity-20"
           style={{
             backgroundImage: `
               linear-gradient(transparent 95%, #4b5563 95%),
               linear-gradient(90deg, transparent 90px, #ef4444 90px, transparent 92px)
             `,
             backgroundSize: '100% 2rem, 100% 100%',
             backgroundAttachment: 'local'
           }}
      />

      {/* Title Tag */}
      {title && (
        <div className="relative z-10 pt-6 px-8 pb-2">
            <span className={`inline-block px-4 py-1 ${headerColor} shadow-sm -rotate-1 font-marker text-xl text-gray-800 dark:text-gray-900 border-t border-l border-white/50`}>
                {title}
            </span>
        </div>
      )}

      {/* Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
        {children}
      </div>
    </div>
  );
};