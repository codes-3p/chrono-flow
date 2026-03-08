

## Plan: Rebuild SlideAI to Match Presenti.ai Feature Set

After reading all 6 pages you created on presenti.ai, here is the complete feature set and how we will implement it, broken into phases.

---

### Features Identified from Your Pages

1. **Generate with AI** (text-to-presentation) - Topic prompt OR paste text, choose page count (1-60), AI model selection, language selector
2. **PDF to Presentation** - Upload PDF (max 15k words), AI extracts content and generates slides
3. **Word to Presentation** - Upload .doc/.docx, detect H1/H2/H3 outline structure, convert to slides
4. **Markdown to Presentation** - Paste or upload .md, AI expands content into slides
5. **Beautify Slides** - Upload existing .pptx, AI redesigns with professional layouts/colors/typography
6. **Marketing Presentation** - Multi-format input, AI content generation, smart design automation, template library
7. **Export** - PPTX and PDF export with visual fidelity
8. **Template Library** - Categories: Business, Marketing, Education, Pitch Deck, Minimalist, Creative
9. **AI Model Selection** - Multiple model options (Basic vs Advanced)
10. **Language Selector** - 20+ languages including PT-BR, EN, ES, FR, DE, etc.

---

### Architecture Plan

#### Phase 1: New Dashboard / Landing Page

Replace the current single-page flow with a **Presenti-style dashboard** with 5 creation cards:

```text
┌──────────────────────────────────────────────────┐
│  SlideAI                                         │
│                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Generate │ │  PDF to  │ │ Word to │           │
│  │ with AI  │ │  Slides  │ │ Slides  │           │
│  └─────────┘ └─────────┘ └─────────┘           │
│  ┌─────────┐ ┌──────────┐                       │
│  │Markdown │ │ Beautify │                       │
│  │to Slides│ │  Slides  │                       │
│  └─────────┘ └──────────┘                       │
└──────────────────────────────────────────────────┘
```

**New routes:**
- `/` - Dashboard with creation cards
- `/create/ai` - Generate with AI (topic + paste text modes)
- `/create/pdf` - PDF upload
- `/create/word` - Word upload
- `/create/markdown` - Markdown upload/paste
- `/create/beautify` - Upload .pptx to beautify
- `/presentation` - Slide viewer + export

#### Phase 2: Enhanced AI Generation Page (`/create/ai`)

Following Presenti's text-to-presentation page exactly:
- **Two tabs**: "Enter a topic" / "Paste Text"
- **Page count selector**: 1-50 pages dropdown
- **AI Model selector**: Basic (Gemini 2.5 Flash) / Advanced (Gemini 2.5 Pro, GPT-5)
- **Language selector**: dropdown with 15+ languages
- **Template selector**: grid of template styles (existing templates, enhanced)
- **Generate button**: triggers the edge function

#### Phase 3: File Import Flows

Create a new edge function `process-file` that:
1. Accepts uploaded files (PDF, DOCX, TXT, MD)
2. Extracts text content using AI parsing
3. Sends extracted text to the existing `generate-presentation` function

**Frontend components:**
- `FileUploadZone` - drag-and-drop area with file type validation
- File-specific pages with upload instructions (Word shows H1-H4 structure guide)
- Max 15,000 words indicator

#### Phase 4: Beautify Slides Flow

- Upload .pptx file
- Parse existing content (extract text from slides)
- Re-generate with premium layouts using AI
- Show before/after comparison

#### Phase 5: Export Fidelity

Keep the current image-capture approach (html-to-image) as primary export method. This is the correct architecture -- the HTML slides ARE the source of truth, and the PPTX gets pixel-perfect images.

Add PDF export option alongside PPTX.

---

### Technical Details

**New files to create:**
- `src/pages/Dashboard.tsx` - Main landing with 5 creation cards
- `src/pages/CreateAI.tsx` - Full AI generation page with all controls
- `src/pages/CreateFromFile.tsx` - Shared file upload page (PDF/Word/Markdown)
- `src/pages/BeautifySlides.tsx` - PPTX upload + beautify
- `src/pages/PresentationView.tsx` - Slide viewer + export (extracted from Index.tsx)
- `src/components/FileUploadZone.tsx` - Drag-and-drop upload component
- `src/components/LanguageSelector.tsx` - Language dropdown
- `src/components/ModelSelector.tsx` - AI model picker
- `src/components/PageCountSelector.tsx` - Slide count dropdown
- `supabase/functions/process-file/index.ts` - File text extraction edge function

**Edge function updates:**
- `generate-presentation` - Add support for `sourceText` param (paste text mode), `model` selection param
- `process-file` - New function: receives file content, extracts text, calls generate-presentation

**Database:** No new tables needed -- this is stateless generation.

---

### Implementation Order (by priority)

1. **Dashboard page** with 5 creation cards + routing
2. **Enhanced AI generation page** (topic/paste text, page count, model, language, templates)
3. **Slide viewer page** (refactored from current Index.tsx)
4. **PDF/Word/Markdown import** (file upload + edge function)
5. **Beautify slides** (PPTX upload + re-design)
6. **PDF export** alongside PPTX

This is a large scope. I recommend implementing in 2-3 rounds, starting with items 1-3 (the core flow redesign).

