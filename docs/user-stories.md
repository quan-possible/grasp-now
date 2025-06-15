# User Stories - grasp.now: Multi-Lens Document Platform

## Epic 1: Document Upload and Management

### US-1.1: Upload Documents
**As a** user  
**I want to** upload documents in various formats (PDF, DOCX, TXT, MD)  
**So that** I can transform them through different lenses for better understanding

**Acceptance Criteria:**
- Support drag-and-drop file upload
- Display upload progress indicator
- Extract text content automatically
- Show error messages for unsupported formats
- Handle multiple file uploads simultaneously

### US-1.2: Organize Documents in Folders
**As a** user  
**I want to** create folders and organize my documents  
**So that** I can maintain a structured library of my learning materials

**Acceptance Criteria:**
- Create new folders with custom names
- Move documents between folders
- Delete folders (with confirmation)
- View folder hierarchy in sidebar
- See document count per folder

### US-1.3: Access Recent Documents
**As a** user  
**I want to** quickly access my recently viewed documents  
**So that** I can continue where I left off

**Acceptance Criteria:**
- Display last 10 accessed documents
- Show timestamp of last access
- One-click to open document
- Clear recent history option

## Epic 2: Core Lens System

### US-2.1: Transform Document with Slide Lens
**As a** consultant preparing for a client meeting  
**I want to** transform a lengthy report into presentation slides  
**So that** I can quickly communicate key insights

**Acceptance Criteria:**
- Generate slides with key concepts
- Visual hierarchy for main points
- Maximum 5-7 points per slide
- Export-ready format
- ~10 second generation time

### US-2.2: Transform Document with Study Lens
**As a** graduate student  
**I want to** convert research papers into detailed study notes  
**So that** I can better understand complex concepts

**Acceptance Criteria:**
- Generate comprehensive notes with examples
- Include learning objectives
- Break down complex sections
- Maintain academic rigor
- Preserve technical terminology

### US-2.3: Transform Document with Story Lens
**As a** journalist  
**I want to** transform factual documents into narrative format  
**So that** I can create engaging articles for readers

**Acceptance Criteria:**
- Convert to magazine-style prose
- Add narrative flow
- Maintain factual accuracy
- Include engaging transitions
- Preserve key information

### US-2.4: Transform Document with Scholar Lens
**As a** researcher  
**I want to** generate academically formatted summaries  
**So that** I can use them in formal publications

**Acceptance Criteria:**
- Formal academic structure
- Proper citation format
- Maintain scholarly tone
- Include methodology references
- Generate bibliography section

### US-2.5: Transform Document with Speed Lens
**As a** busy executive  
**I want to** get executive summaries of documents  
**So that** I can make quick decisions

**Acceptance Criteria:**
- 1-2 page maximum output
- Bullet-point key takeaways
- Action items highlighted
- Critical metrics emphasized
- 30-second read time

## Epic 3: Custom Lens Creation

### US-3.1: Create Custom Lens with Natural Language
**As a** software engineer  
**I want to** create a custom lens by describing my needs in plain English  
**So that** I can get documentation in my preferred format

**Acceptance Criteria:**
- Natural language prompt input
- Example: "Explain like I'm a junior developer learning React"
- Preview lens output before saving
- Edit prompt after creation
- Save to personal lens library

### US-3.2: Save and Reuse Custom Lenses
**As a** user  
**I want to** save my custom lenses for future use  
**So that** I don't have to recreate them for similar documents

**Acceptance Criteria:**
- Name custom lenses
- Organize in personal library
- Apply to any document
- Edit saved lenses
- Delete unused lenses

### US-3.3: Share Custom Lenses
**As a** team lead  
**I want to** share my custom lenses with team members  
**So that** we can standardize document processing

**Acceptance Criteria:**
- Generate shareable link
- Import shared lenses
- Preview before importing
- Maintain attribution
- Control sharing permissions

## Epic 4: Dynamic Focus Control

### US-4.1: Adjust Detail Level for Selected Text
**As a** learner encountering difficult concepts  
**I want to** increase detail level for specific sections  
**So that** I can better understand complex parts

**Acceptance Criteria:**
- Select any text portion
- Slider for detail adjustment (wide ↔ narrow)
- Real-time preview of changes
- Apply changes to current lens
- Undo/redo functionality

### US-4.2: Propagate Focus Changes Across Lenses
**As a** user  
**I want** my focus adjustments to apply across all lenses  
**So that** I maintain consistent detail levels

**Acceptance Criteria:**
- Changes reflect in all generated lenses
- Maintain context consistency
- Preview impact before applying
- Option to apply selectively
- Preserve original versions

## Epic 5: Citation and Source Transparency

### US-5.1: View Source Citations
**As a** journalist verifying facts  
**I want to** see exactly which parts of the original document were used  
**So that** I can verify accuracy and maintain integrity

**Acceptance Criteria:**
- Click any transformed section
- Highlight source passages
- Show confidence indicators
- Side-by-side comparison view
- Copy source with citation

### US-5.2: Navigate Citation Heat Map
**As a** researcher  
**I want to** see a visual map of source density  
**So that** I can identify heavily referenced sections

**Acceptance Criteria:**
- Color-coded heat map overlay
- Darker = more citations
- Click to jump to section
- Toggle visibility
- Export citation report

## Epic 6: Editor and Content Creation

### US-6.1: Edit Transformed Content
**As a** content creator  
**I want to** edit the AI-generated content  
**So that** I can personalize it for my needs

**Acceptance Criteria:**
- Rich Markdown editor (Milkdown)
- Slash commands for formatting
- Drag-drop blocks
- Insert images/tables/code
- Auto-save functionality

### US-6.2: Use Notion-Like Editing Features
**As a** user familiar with Notion  
**I want to** use similar editing shortcuts and features  
**So that** I can work efficiently

**Acceptance Criteria:**
- "/" for command menu
- Drag handle for blocks
- Markdown shortcuts
- Block transformations
- Nested content support

## Epic 7: Learning Journey Tracking

### US-7.1: View Comprehension Timeline
**As a** self-directed learner  
**I want to** track my understanding progress over time  
**So that** I can see how my comprehension improves

**Acceptance Criteria:**
- Visual timeline of interactions
- Show lens switches
- Track focus adjustments
- Time spent per section
- Comprehension milestones

### US-7.2: Export Learning Package
**As a** student  
**I want to** export my entire learning journey  
**So that** I can review it offline or share with instructors

**Acceptance Criteria:**
- Export all lens versions
- Include annotations
- Package as ZIP/PDF
- Maintain formatting
- Include metadata

## Epic 8: Collaboration Features

### US-8.1: Share Document with Lenses
**As a** team member  
**I want to** share documents with applied lenses  
**So that** others can benefit from my analysis

**Acceptance Criteria:**
- Generate shareable link
- Include selected lenses
- Read-only by default
- Optional edit permissions
- Expiration settings

### US-8.2: Comment on Shared Documents
**As a** collaborator  
**I want to** add comments to shared documents  
**So that** we can discuss insights together

**Acceptance Criteria:**
- Inline commenting
- Thread discussions
- @mention teammates
- Resolve comments
- Email notifications

## Epic 9: Account and Settings

### US-9.1: Manage Account Settings
**As a** user  
**I want to** update my profile and preferences  
**So that** I can personalize my experience

**Acceptance Criteria:**
- Update display name
- Change email
- Set default lens preferences
- Manage notifications
- Theme selection (light/dark)

### US-9.2: Track Usage and Limits
**As a** user  
**I want to** see my usage statistics  
**So that** I can manage my subscription effectively

**Acceptance Criteria:**
- Documents processed count
- Storage used
- AI tokens consumed
- Lens generation history
- Export usage reports

## Epic 10: Mobile and Offline Access

### US-10.1: Access Documents on Mobile
**As a** user on the go  
**I want to** read my transformed documents on mobile devices  
**So that** I can learn anywhere

**Acceptance Criteria:**
- Responsive mobile interface
- Swipe between lenses
- Pinch to zoom
- Offline reading mode
- Sync across devices

### US-10.2: Download for Offline Use
**As a** traveler  
**I want to** download documents and lenses for offline access  
**So that** I can study without internet

**Acceptance Criteria:**
- Select documents to download
- Include chosen lenses
- Automatic sync when online
- Manage offline storage
- Clear cache option

## Success Metrics

Each user story contributes to key platform metrics:
- **Time to First Insight**: Reduce from baseline by 80%
- **Comprehension Scores**: Improve by 40%
- **User Engagement**: Average 3+ lenses per document
- **Custom Lens Creation**: 60% of users create at least one
- **Return Usage**: 85% weekly active users
- **Collaboration**: 30% of documents shared
- **Citation Verification**: 25% click-through rate