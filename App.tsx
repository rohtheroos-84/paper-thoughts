import React, { useState, useRef, useEffect } from 'react';
import { analyzeNotes } from './services/geminiService';
import { AnalysisResponse, Mood, ParagraphAnalysis } from './types';
import { StickyNote } from './components/StickyNote';
import { NotebookSheet } from './components/NotebookSheet';
import { Timeline } from './components/Timeline';
import { StudyPlan } from './components/StudyPlan';
import { ImageUpload } from './components/ImageUpload';
import { jsPDF } from 'jspdf';

// --- Navigation Component ---
const NavBar = ({ currentPage, setPage, darkMode, toggleDarkMode }: any) => (
  <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-4 select-none transition-colors duration-300 shadow-sm z-50 sticky top-0">
    <div className="flex items-center space-x-2">
        <div className="flex space-x-1.5 mr-3">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-600 border border-black/10"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-600 border border-black/10"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-600 border border-black/10"></div>
        </div>
        <div className="text-gray-600 dark:text-gray-300 text-lg font-bold font-marker tracking-wide cursor-pointer hover:text-gray-800 dark:hover:text-white" onClick={() => setPage('home')}>
          PaPeR ThOuGhTs
        </div>
    </div>
    
    <div className="flex items-center space-x-6 font-hand text-lg text-gray-600 dark:text-gray-400">
        {['Home', 'Scan', 'About'].map((page) => (
             <button 
                key={page}
                onClick={() => setPage(page.toLowerCase())}
                className={`hover:text-gray-900 dark:hover:text-white transition-colors ${currentPage === page.toLowerCase() ? 'text-blue-600 dark:text-blue-400 font-bold underline decoration-wavy' : ''}`}
             >
                {page}
             </button>
        ))}
        
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {darkMode ? (
                <svg className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 24.042l-1.354-1.354 1.354-1.354zm-2.12 0l-1.355-1.354 1.354-1.354zm-2.122 0l-1.354-1.354 1.354-1.354zM21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            )}
        </button>
    </div>
  </div>
);

// --- Home Page ---
const HomePage = ({ onStart }: { onStart: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 animate-slide-up-fade">
        <h1 className="font-marker text-5xl md:text-7xl text-gray-800 dark:text-gray-100 mb-6 drop-shadow-sm">PaPeR ThOuGhTs</h1>
        <p className="font-hand text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed">
            See where your lecture notes felt <span className="text-yellow-600 dark:text-yellow-400">confused</span>, 
            <span className="text-green-600 dark:text-green-400"> confident</span>, 
            <span className="text-slate-500 dark:text-slate-400"> bored</span>, or 
            <span className="text-red-500 dark:text-red-400"> alert</span>.
        </p>
        
        {/* Simple Hero Graphic (CSS art notebook) */}
        <div className="w-64 h-48 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl mb-12 relative overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
             <div className="absolute top-0 left-4 bottom-0 w-[1px] bg-red-200"></div>
             <div className="absolute top-8 left-0 right-0 h-[1px] bg-blue-100 dark:bg-gray-700"></div>
             <div className="absolute top-16 left-0 right-0 h-[1px] bg-blue-100 dark:bg-gray-700"></div>
             <div className="absolute top-24 left-0 right-0 h-[1px] bg-blue-100 dark:bg-gray-700"></div>
             <div className="absolute top-10 left-8 right-8 h-4 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
             <div className="absolute top-26 left-8 right-16 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
        </div>

        <button 
            onClick={onStart}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-marker text-xl rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
        >
            Start Analyzing Notes
        </button>
    </div>
);

// --- About Page ---
const AboutPage = ({ onBack }: { onBack: () => void }) => (
    <div className="max-w-3xl mx-auto p-8 font-hand text-lg text-gray-800 dark:text-gray-200 animate-slide-up-fade">
        <NotebookSheet title="About Paper Thoughts" headerColor="bg-purple-200">
            <div className="space-y-6">
                <section>
                    <h2 className="font-bold font-marker text-xl mb-2">What does this do?</h2>
                    <p>Paper Thoughts takes your raw lecture notes and uses AI to "read the room" of your own writing. It breaks text into paragraphs and tags them with a mood based on your tone.</p>
                    <p className="mt-2 text-sm opacity-80">New: You can now upload images of handwritten or printed notes, and the AI will extract the text for you!</p>
                </section>
                
                <section>
                    <h2 className="font-bold font-marker text-xl mb-2">How it works</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><span className="bg-yellow-200 dark:bg-yellow-800 dark:text-white px-1">Confused</span> if you ask many questions or use words like "idk", "what?".</li>
                        <li><span className="bg-green-200 dark:bg-green-800 dark:text-white px-1">Confident</span> if you summarize well or use "therefore", "key point".</li>
                        <li><span className="bg-slate-200 dark:bg-slate-700 dark:text-white px-1">Bored</span> if notes are dismissive, short, or repetitive ("blah blah").</li>
                        <li><span className="bg-red-200 dark:bg-red-900 dark:text-white px-1">Alert</span> if notes are dense with terms like "Important!", "Exam".</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold font-marker text-xl mb-2">Image Upload Feature</h2>
                    <p>Upload photos or screenshots of your handwritten or printed lecture notes. The AI will:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Extract all visible text from the image</li>
                        <li>Preserve formatting and paragraph structure</li>
                        <li>Let you review and edit the text before analysis</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold font-marker text-xl mb-2">Privacy & Limitations</h2>
                    <p>This is a study aid, not a grading tool. The AI might misinterpret sarcasm or complex notes. Your notes and images are sent to Google Gemini for processing but are not stored by this app.</p>
                </section>

                <div className="pt-8 text-center">
                    <button onClick={onBack} className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">Back to Scan</button>
                </div>
            </div>
        </NotebookSheet>
    </div>
);

// --- Main App ---
export default function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [paragraphs, setParagraphs] = useState<ParagraphAnalysis[]>([]); // Separated for reordering
  const [error, setError] = useState<string | null>(null);
  const [filterMood, setFilterMood] = useState<Mood | 'ALL'>('ALL');
  const [showImageUpload, setShowImageUpload] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Dark Mode Init
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      if (newMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
      }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null); // Clear old results
    
    try {
      const data = await analyzeNotes(inputText);
      setResult(data);
      setParagraphs(data.paragraphs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze notes. Please try again.";
      setError(errorMessage);
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setParagraphs([]);
    setError(null);
    setShowImageUpload(false);
    if (textAreaRef.current) textAreaRef.current.focus();
  };

  const handleTextExtracted = (text: string) => {
    setInputText(text);
    setShowImageUpload(false);
    setError(null);
    // Focus on textarea to allow user to edit
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const handleImageUploadError = (errorMsg: string) => {
    setError(errorMsg);
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    // Hide ghost slightly or style it
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const onDrop = (e: React.DragEvent) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const copyListItems = [...paragraphs];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    setParagraphs(copyListItems);
  };

  const scrollToParagraph = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight effect
          el.classList.add('ring-2', 'ring-blue-400');
          setTimeout(() => el.classList.remove('ring-2', 'ring-blue-400'), 1000);
      }
  };

  const downloadPDF = () => {
      if (!result) return;
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Lecture Mood Analysis", 10, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Generated by Paper Thoughts on ${new Date().toLocaleDateString()}`, 10, 30);
      
      let y = 40;
      
      // Study Plan
      doc.setFont("helvetica", "bold");
      doc.text("Study Plan Suggestion:", 10, y);
      y+= 7;
      doc.setFont("helvetica", "italic");
      doc.text(doc.splitTextToSize(result.studyPlan.suggestion || "No specific suggestion.", 180), 10, y);
      y+= 20;

      // Paragraphs
      doc.setFont("helvetica", "bold");
      doc.text("Notes Breakdown:", 10, y);
      y+= 10;

      paragraphs.forEach((p, i) => {
          if (y > 270) { doc.addPage(); y = 20; }
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          // Color code text based on mood roughly? No, keep PDF simple black/white
          doc.text(`Para ${i+1} [${p.mood.toUpperCase()}] - Importance: ${p.importance}`, 10, y);
          y+=5;
          
          doc.setFont("helvetica", "normal");
          const splitText = doc.splitTextToSize(p.text, 180);
          doc.text(splitText, 10, y);
          y += (splitText.length * 5) + 5;
      });

      doc.save("lecture-moods.pdf");
  };

  const visibleParagraphs = paragraphs.filter(p => filterMood === 'ALL' || p.mood === filterMood);

  return (
    <div className={`min-h-screen w-full font-hand text-gray-800 dark:text-gray-100 selection:bg-yellow-200/50 dark:selection:bg-yellow-700/50 bg-[#f0ebe1] dark:bg-[#1e1e24] flex flex-col`}>
      
      <NavBar currentPage={page} setPage={setPage} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-1 p-4 md:p-8 flex justify-center">
        {page === 'home' && <HomePage onStart={() => setPage('scan')} />}
        {page === 'about' && <AboutPage onBack={() => setPage('scan')} />}
        
        {page === 'scan' && (
             <div className="w-full max-w-[1600px] h-[85vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-600 flex flex-col overflow-hidden relative transition-colors duration-300">
                
                {/* OS Window Header */}
                <div className="h-8 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-4 select-none">
                  <div className="flex items-center space-x-2 opacity-50">
                     <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                     <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  </div>
                  <div className="text-gray-400 text-xs font-semibold tracking-wide font-sans uppercase">
                    Scan Session - {new Date().toLocaleDateString()}
                  </div>
                  <div className="w-10"></div>
                </div>

                {/* OS Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f8f8f8] dark:bg-gray-900">
                  
                  {/* LEFT: Input Area */}
                  <div className="w-full md:w-5/12 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700 relative z-10 flex flex-col">
                    <NotebookSheet title="Input Notes" headerColor="bg-blue-200">
                       {/* Tab Switcher */}
                       <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                         <button
                           onClick={() => setShowImageUpload(false)}
                           className={`px-4 py-2 font-marker text-sm rounded-t transition-colors ${
                             !showImageUpload
                               ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-b-2 border-blue-500'
                               : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                           }`}
                         >
                           Type / Paste Text
                         </button>
                         <button
                           onClick={() => setShowImageUpload(true)}
                           className={`px-4 py-2 font-marker text-sm rounded-t transition-colors ${
                             showImageUpload
                               ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-b-2 border-blue-500'
                               : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                           }`}
                         >
                           Upload Image
                         </button>
                       </div>

                       {/* Text Input */}
                       {!showImageUpload && (
                         <textarea
                            ref={textAreaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste your lecture notes here or switch to 'Upload Image' to scan handwritten notes..."
                            className="w-full h-full bg-transparent resize-none outline-none text-lg md:text-xl leading-8 text-gray-700 dark:text-gray-300 placeholder-gray-400/70 font-hand"
                            spellCheck={false}
                         />
                       )}

                       {/* Image Upload */}
                       {showImageUpload && (
                         <div className="h-full overflow-y-auto">
                           <ImageUpload
                             onTextExtracted={handleTextExtracted}
                             onError={handleImageUploadError}
                           />
                         </div>
                       )}
                    </NotebookSheet>
                    
                    {/* Action Bar (Pinned bottom of input col) */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center z-20">
                         <button onClick={handleClear} className="text-sm text-gray-500 hover:text-red-500 font-marker">Clear All</button>
                         <button
                           onClick={handleAnalyze}
                           disabled={isAnalyzing || !inputText.trim()}
                           className={`
                             px-6 py-2 rounded-sm shadow-md font-marker transform transition-all text-lg border-b-2
                             ${isAnalyzing || !inputText.trim() 
                                ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' 
                                : 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900 border-yellow-600 hover:-translate-y-1'
                             }
                           `}
                         >
                           {isAnalyzing ? 'Analyzing...' : 'Analyze Moods'}
                         </button>
                    </div>
                  </div>

                  {/* RIGHT: Results Area */}
                  <div className="w-full md:w-7/12 h-1/2 md:h-full relative bg-[#fdfbf7] dark:bg-gray-900 flex">
                     {/* Notebook Tabs */}
                     <div className="w-12 flex flex-col pt-16 gap-2 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 z-20">
                        {['ALL', Mood.CONFUSED, Mood.CONFIDENT, Mood.BORED, Mood.ALERT].map((m) => (
                            <button
                                key={m}
                                onClick={() => setFilterMood(m as Mood | 'ALL')}
                                className={`
                                    h-24 w-8 -mr-[1px] rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all
                                    ${filterMood === m ? 'bg-white dark:bg-gray-700 w-10 shadow-sm translate-x-2 font-bold' : 'bg-gray-200 dark:bg-gray-900 opacity-60 hover:opacity-100'}
                                `}
                            >
                                <span className="transform -rotate-90 text-xs uppercase tracking-widest whitespace-nowrap">
                                    {m === 'ALL' ? 'All Notes' : m}
                                </span>
                            </button>
                        ))}
                     </div>

                     <div className="flex-1 overflow-hidden relative">
                         <NotebookSheet title="Analysis Results" headerColor="bg-green-200">
                            
                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-4 border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                <h3 className="font-marker text-gray-500 dark:text-gray-400 text-sm uppercase">
                                    {result ? `${paragraphs.length} Paragraphs Found` : 'Waiting for input'}
                                </h3>
                                {result && (
                                    <button onClick={downloadPDF} className="text-xs flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                                        Download PDF
                                    </button>
                                )}
                            </div>

                            <div className="pb-12 min-h-full">
                               {/* Empty State */}
                               {!result && !isAnalyzing && !error && (
                                 <div className="flex flex-col items-center justify-center h-64 opacity-40">
                                    <p className="font-hand text-2xl -rotate-2 text-center text-gray-400">
                                      "Run an analysis to see the<br/>mood timeline here."
                                    </p>
                                 </div>
                               )}

                               {/* Error State */}
                               {error && !isAnalyzing && (
                                   <div className="flex flex-col items-center justify-center p-12">
                                       <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 max-w-lg">
                                           <div className="flex items-start gap-3">
                                               <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                               </svg>
                                               <div>
                                                   <h3 className="font-marker text-lg text-red-700 dark:text-red-400 mb-2">Analysis Failed</h3>
                                                   <p className="font-hand text-red-600 dark:text-red-300">{error}</p>
                                                   <p className="font-hand text-sm text-red-500 dark:text-red-400 mt-2 opacity-75">Check the browser console for more details.</p>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {/* Analysis Content */}
                               {isAnalyzing && (
                                   <div className="flex justify-center p-12">
                                       <div className="font-hand text-xl animate-pulse">Reading your notes...</div>
                                   </div>
                               )}

                               {result && !isAnalyzing && (
                                   <>
                                     <Timeline paragraphs={paragraphs} onParagraphClick={scrollToParagraph} />
                                     
                                     <StudyPlan plan={result.studyPlan} paragraphs={paragraphs} />
                                     
                                     {visibleParagraphs.length === 0 && (
                                         <div className="text-center italic opacity-50 py-10">No paragraphs match this mood filter.</div>
                                     )}

                                     {visibleParagraphs.map((p, idx) => {
                                         // We need the true index in the full array for drag operations to work correctly on the full list
                                         // But drag-n-drop usually feels weird when filtered. 
                                         // Recommendation: Disable DnD when filtered, or just allow it and let the user be confused.
                                         // Better UX: Only enable DnD when filterMood === 'ALL'.
                                         const realIndex = paragraphs.indexOf(p);

                                         return (
                                             <StickyNote 
                                                key={p.id}
                                                id={p.id}
                                                index={realIndex}
                                                text={p.text}
                                                mood={p.mood}
                                                importance={p.importance}
                                                keywords={p.keywords}
                                                onDragStart={(e, i) => filterMood === 'ALL' && onDragStart(e, i)}
                                                onDragOver={(e, i) => filterMood === 'ALL' && onDragOver(e, i)}
                                                onDrop={(e, i) => filterMood === 'ALL' && onDrop(e)}
                                             />
                                         );
                                     })}
                                   </>
                               )}
                               
                               <div className="h-20"></div>
                            </div>
                         </NotebookSheet>
                     </div>
                  </div>

                </div>
             </div>
        )}
      </main>
    </div>
  );
}