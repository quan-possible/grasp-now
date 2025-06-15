# grasp.now - Multi-Lens Document Platform

## 1. Overview

grasp.now is a revolutionary platform that radically accelerates human learning by transforming any document through multiple **lenses**—from high-level slides to deep technical notes to narrative articles—each optimized for different comprehension needs. Users can instantly switch lenses, adjust focus (detail level), create custom lenses with their own prompts, and always see exactly where information originates through transparent citations.

## 2. Mission

**Radically accelerate human learning** by enabling readers to comprehend any document through the perfect lens for their current need, eliminating the friction between content and understanding.

## 3. Problem Statement

Learners waste countless hours because:
- Documents are trapped in single, often incompatible formats
- No easy way to shift between overview and deep-dive modes
- AI-transformed content lacks source transparency
- One-size-fits-all approaches ignore individual learning styles
- Static documents can't adapt to changing comprehension needs

## 4. Core Solution: The Lens System

**Pre-Built Lenses**: Professional transformations for common needs:
- **Slide Lens**: Key concepts, visual hierarchy, presentation-ready
- **Study Lens**: Detailed notes, examples, learning objectives
- **Story Lens**: Narrative flow, engaging prose, magazine-style
- **Scholar Lens**: Academic rigor, formal structure, citations
- **Speed Lens**: Executive summary, key takeaways only

**Custom Lens Builder**: 
- Users craft lenses with natural language prompts
- "Explain like I'm a [role] trying to [goal]"
- Save and share custom lenses
- Build a personal lens library

**Dynamic Focus Control**: 
- Select any text and adjust detail level (wide ↔ narrow focus)
- Changes propagate intelligently across all lenses
- Real-time preview before committing

**Citation Transparency**: 
- Every transformed section links to source passages
- Confidence indicators show interpretation level
- Side-by-side source comparison mode

**Lens-Aware Versioning**: 
- Track changes across all lenses simultaneously
- See how focus adjustments affect different lenses
- Branch and merge lens configurations

## 5. Feature Prioritization (Lens-Centric MVP)

| Feature | Description | MVP? |
|---------|-------------|------|
| Document Upload | Multi-format ingestion (PDF, DOCX, TXT, MD) | Yes |
| Core Lens Set | Generate 3 lenses: Slide, Study, Story | Yes |
| Lens Switcher | Instant toggle with position sync | Yes |
| Focus Control | Select text → adjust detail granularity | Yes |
| Citation System | Source linking and transparency | Yes |
| Version Timeline | Track changes across lenses | Yes |
| Custom Lens Builder | Create lenses with prompts | Yes |
| Project Folders | Organize documents into user-created folders, with navigation (via `HomeLeftSidebar.tsx`) and viewing of folder contents (via `FolderViewPage.tsx`). Documents can be assigned to folders upon upload. | Yes |
| Lens Library | Save/share custom lenses | No (Phase 2) |
| Advanced Scholar Lens | Academic formatting, bibliographies | No (Phase 2) |
| Chat with Document | Context-aware Q&A | No (Phase 2) |
| Team Collaboration | Shared lenses and annotations | No (Phase 3) |

## 6. User Journey: "From Upload to Understanding"

1.  **Drop Document**: Drag any document into grasp.now (e.g., on `HomePage`). User can optionally select an existing folder or create a new one to upload the document into.
1.5. **Organize (Optional)**: Before or after upload, the user can navigate their folder structure using the `HomeLeftSidebar.tsx`. They can create new folders using the `CreateFolderModal` or view contents of existing folders on `FolderViewPage.tsx`.
2.  **Instant Lenses**: Core lenses generate in parallel (~10 seconds). The original document opens in the main editor tab.
3.  **Explore Views**: Users can open additional tabs for AI-generated views like Summaries, Outlines, or FAQs using the "Add New View" button. A preview panel allows quick glances into each tab's content.
4.  **Quick Scan**: Start with Slide Lens or Summary view for an overview.
5.  **Deep Dive**: Switch to Study Lens or the Original document for complex sections
6.  **Adjust Focus**: Select confusing parts, increase detail
7.  **Create Custom Lens**: "Explain this like I'm preparing for an interview"
8.  **Track Learning**: Version timeline shows your comprehension journey
9.  **Export Knowledge**: Download focused version or lens package

## 7. Custom Lens Examples

**Pre-built Templates**:
- "ELI5 Lens" → Explain like I'm five
- "Podcast Lens" → Conversational script format
- "Debate Lens" → Arguments and counterarguments
- "Visual Lens" → Emphasize diagrams and metaphors

**User Prompts**:
- "Transform this into a step-by-step tutorial for beginners"
- "Rewrite as if teaching a graduate seminar"
- "Make this sound like a TED talk"
- "Extract only the actionable insights"

## 8. UI Design: Lens-First Interface

**Lens Ring** (Top Center) - *Current implementation uses a Tab Bar in `MainContent.tsx`*:
- A tab-based system allows switching between the original document and various AI-generated lenses (views).
- An "Add New View" modal allows users to select from available AI transformations.
- A collapsible preview panel shows mini-previews of each open tab.

**Folder Navigation** (`HomeLeftSidebar.tsx`):
- Provides a hierarchical view of user's folders.
- Allows creation of new folders and navigation to folder-specific views (`FolderViewPage.tsx`).
- Documents within folders can be displayed and accessed directly from the sidebar.

**Focus Slider** (Right Panel):
- Vertical slider for detail level
- Live preview as you adjust
- Section-specific or document-wide

**Citation Layer** (Left Margin):
- Heat map showing source density
- Click to reveal original text
- Confidence indicators (high/medium/low)

**Learning Timeline** (Bottom):
- Horizontal progression through versions
- Lens icons show which were modified
- Checkpoint notes for major insights

## 9. Technical Architecture

**Frontend**:
- React with lens state management
- Smooth lens transition engine
- Real-time focus adjustment preview
- Citation overlay system

**Backend**:
- Parallel LLM pipeline for multi-lens generation
- Custom lens prompt optimization
- Incremental focus adjustment API
- Citation extraction and confidence scoring

**AI Pipeline**:
- **Lens Generation**: Parallel processing with specialized prompts
- **Focus Engine**: Dynamic detail expansion/contraction
- **Citation Mapper**: Source-to-lens alignment with confidence scores
- **Custom Lens Compiler**: Prompt optimization and caching

**Storage**:
- Original document preservation
- Lens transformation cache
- Citation index with confidence scores
- User lens library

## 10. Success Metrics

**Primary KPIs**:
- Time to first insight (baseline → with lenses)
- Comprehension test scores improvement
- Number of lens switches per session
- Custom lens creation and reuse rates

**Engagement Metrics**:
- Average lenses used per document
- Focus adjustment frequency
- Citation verification clicks
- Lens sharing/adoption rates

## 11. Go-to-Market Strategy

**Target Early Adopters**:
1. Graduate students (complex papers)
2. Consultants (rapid client research)
3. Software engineers (documentation)
4. Journalists (source analysis)

**Key Messaging**:
"Stop reading. Start understanding."
"Every document, through every lens you need."
"From overview to expertise in seconds."

## 12. Development Phases

### Phase 1: Core Lens Engine (Weeks 1-4)
- MVP with 3 core lenses
- Basic focus control
- Custom lens builder
- Citation system

### Phase 2: Lens Ecosystem (Weeks 5-8)
- Lens library and sharing
- Advanced lens types
- Chat integration
- Performance optimization

### Phase 3: Collaboration (Weeks 9-12)
- Team workspaces
- Shared lens collections
- Annotation layers
- API access

### Phase 4: Intelligence (Months 4-6)
- Auto-lens recommendations
- Learning path generation
- Knowledge graph building
- Cross-document lens application

## 13. Competitive Advantages

1. **Multi-Lens Approach**: Not just summarization or single-format conversion
2. **Dynamic Focus**: Granular control over detail levels
3. **Citation Transparency**: Full source traceability
4. **Custom Lens Creation**: Infinite personalization
5. **Learning Acceleration**: Designed for comprehension speed, not just reading

## 14. Technical Differentiators

- **Parallel Processing**: All lenses generate simultaneously
- **Incremental Updates**: Focus changes don't regenerate entire document
- **Smart Caching**: Reuse transformations across similar documents
- **Confidence Scoring**: Show interpretation reliability
- **Position Intelligence**: Maintain reading position across lens switches

## 15. Future Vision

Build grasp.now into the **"Photoshop of Reading"** where users can:
- Apply lens filters to any text
- Combine multiple lenses
- Create lens workflows
- Share lens presets
- Build domain-specific lens packs

Ultimately: Transform how humanity processes and understands information, making expert-level comprehension accessible to everyone.