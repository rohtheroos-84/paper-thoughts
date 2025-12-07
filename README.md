# Paper Thoughts

A notebook-styled web application that analyzes lecture notes and categorizes them by mood using Gemini's wrath. Visualize where your notes felt confused, confident, bored, or alert with an intuitive timeline interface and drag-and-drop organization.

## Features

### AI-Powered Mood Analysis
- Automatically categorizes each paragraph of your lecture notes into four moods:
  - **Confused**: Identifies questions, uncertainty, hesitant language, and phrases like "idk", "wtf", "recheck"
  - **Confident**: Detects summary tones, definitions, "therefore", "key point", and structured content
  - **Bored**: Recognizes dismissive language, repetitive words, "boring", "useless", "skip", "blah blah"
  - **Alert**: Highlights important content with "exam question", "remember this", "imp", and dense key terms

### Interactive Timeline Visualization
- Visual timeline strip showing mood distribution across your entire note sequence
- Color-coded segments for quick pattern recognition
- Confusion heatmap identifying sections with highest concentration of confused paragraphs
- Hover tooltips displaying paragraph previews
- Click-to-scroll navigation to any paragraph

### Smart Study Plan Generation
- AI-generated study recommendations based on mood analysis
- Identifies top 2-3 most confused paragraphs requiring review
- Highlights 1-2 confident/alert paragraphs showing strong understanding
- Provides personalized study suggestions

### Organizational Features
- Drag-and-drop paragraph reordering for custom organization
- Mood-based filtering (All, Confused, Confident, Bored, Alert)
- Importance tagging (Low, Medium, High) for each paragraph
- Keyword extraction highlighting key terms in context
- Sticky note visual design with random rotations for organic feel

### Export and Sharing
- PDF export functionality with complete analysis
- Includes study plan suggestions and mood breakdown
- Formatted for easy printing and offline review

### User Experience
- Notebook OS-themed interface with authentic paper textures
- Dark mode support with persistent theme preferences
- Responsive design for desktop and mobile devices
- Smooth animations and transitions
- Three-dot macOS-style window controls
- Tab-based navigation sidebar for mood filtering

### Visual Design Elements
- Paper texture with ruled lines and red margin
- Simulated tape and paper clip graphics
- Handwritten font styling (marker and hand fonts)
- Color-coded mood highlighting throughout the interface
- Custom scrollbars matching the notebook aesthetic

## Technology Stack

- **Frontend**: React 19.2.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini 2.5 Flash via @google/genai
- **PDF Generation**: jsPDF 2.5.1
- **Styling**: Tailwind CSS with custom themes
- **Type Safety**: TypeScript 5.8.2

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rohtheroos-84/paper-thoughts.git
cd paper-thoughts
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Navigate to the home page and click "Start Analyzing Notes"
2. Paste your lecture notes into the left input panel
3. Click "Analyze Moods" to process your notes with AI
4. Review the analysis in the right panel:
   - View the mood timeline at the top
   - Read the AI-generated study plan
   - Scroll through color-coded paragraph cards
5. Use the sidebar tabs to filter by specific moods
6. Drag and drop paragraphs to reorganize (available when showing all notes)
7. Download your analysis as a PDF for offline study

## Project Structure

```
paper-thoughts/
├── components/
│   ├── NotebookSheet.tsx      # Reusable notebook-styled container
│   ├── StickyNote.tsx          # Individual paragraph display with drag-and-drop
│   ├── StudyPlan.tsx           # AI-generated study recommendations
│   └── Timeline.tsx            # Visual mood timeline and heatmap
├── services/
│   └── geminiService.ts        # Google Gemini AI integration
├── App.tsx                     # Main application component
├── types.ts                    # TypeScript type definitions
├── index.tsx                   # React entry point
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── metadata.json               # Application metadata
```

## API Configuration

The application uses structured output from Google Gemini AI with a defined schema:
- Paragraph-level mood classification
- Importance ratings (Low/Medium/High)
- Keyword extraction (up to 4 per paragraph)
- Summary statistics for all mood categories
- Study plan with confused/confident paragraph indices

## Build

To create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Repository

https://github.com/rohtheroos-84/paper-thoughts
