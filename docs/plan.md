# grasp.now Implementation Plan

## Executive Summary
This document outlines the technical implementation plan for grasp.now, following the resilient architecture defined in `architecture.md`. The implementation uses a "steel thread" approach, delivering end-to-end functionality in Week 1, then expanding to the full platform over 6 months.

## Project Setup & Infrastructure (Week 0)

### Development Environment
1. **Repository Structure**
   ```
   grasp-now/
   ├── frontend/                 # Existing React application
   ├── backend/
   │   ├── functions/           # Firebase Cloud Functions
   │   ├── workers/             # Cloud Run workers
   │   └── scripts/             # Deployment scripts
   ├── .github/workflows/       # CI/CD pipelines
   └── docs/                    # Documentation
   ```

2. **Initial Setup Tasks**
   - Enable GCP APIs: Cloud Run, Pub/Sub, Cloud Build
   - Create Firebase project with Firestore and Storage
   - Configure authentication providers in Firebase Console
   - Create `process-document` Pub/Sub topic
   - Set up development and production environments
   - Configure GitHub Actions for deployment

3. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth.uid == userId;
       }
       match /documents/{documentId} {
         allow read, write: if request.auth.uid == resource.data.ownerId;
         match /lenses/{lensId} {
           allow read: if request.auth.uid == get(/databases/$(database)/documents/documents/$(documentId)).data.ownerId;
         }
       }
     }
   }
   ```

## Phase 0: Steel Thread (Week 1)

### Goal
User can upload a PDF and see one generated "Slide Lens" appear in real-time, validating the entire architecture pipeline.

### Day 1-2: Backend Infrastructure
**Cloud Function Tasks:**
- Create `extractTextAndQueue` function triggered by Storage uploads
- Implement PDF text extraction using `pdf-parse`
- Store extracted text in Firestore document
- Publish message to `process-document` Pub/Sub topic
- Add error handling and logging

**Firestore Schema:**
```typescript
interface Document {
  id: string;
  ownerId: string;
  title: string;
  fileUrl: string;
  extractedText: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  createdAt: Timestamp;
  processedAt?: Timestamp;
  errorMessage?: string;
}
```

### Day 3-4: Lens Generation Worker
**Cloud Run Job Tasks:**
- Create `lens-generator-mvp` worker in Node.js/TypeScript
- Configure Cloud Run Job triggered by Pub/Sub
- Implement Gemini 1.5 Pro integration
- Generate single "Slide Lens" with MVP citation format
- Write lens to Firestore subcollection
- Update document status to 'ready'

**Worker Implementation:**
```typescript
// Process flow:
// 1. Receive docId from Pub/Sub message
// 2. Fetch extractedText from Firestore
// 3. Call Gemini API with Slide Lens prompt
// 4. Parse response and add :::source[...] citations
// 5. Write to documents/{docId}/lenses/slide-lens
// 6. Update parent document status
```

### Day 5: Frontend Integration
**UI Tasks:**
- Add Firestore listener to `DocumentViewPage`
- Create lens state management in `editorStore`
- Update `MainContent` to render lens tabs dynamically
- Implement loading states during processing
- Add error handling for failed generations

**Real-time Updates:**
```typescript
// Listen for new lenses in subcollection
// Update UI automatically when lenses appear
// No polling or manual refresh needed
```

## Phase 1: Core Lens Engine (Weeks 2-4)

### Week 2: Complete Lens Trinity
**Backend Tasks:**
- Expand `lens-generator` to create all three core lenses
- Implement parallel processing with Promise.all()
- Add Study Lens prompt (detailed notes with examples)
- Add Story Lens prompt (narrative magazine format)
- Update worker to write lenses as they complete
- Implement proper error handling per lens

**Frontend Tasks:**
- Update UI to handle multiple lens tabs
- Add smooth transitions between lenses
- Implement position synchronization prep
- Polish loading states for each lens

### Week 3: Text Extraction & Upload Pipeline
**Backend Enhancements:**
- Add DOCX support using `mammoth.js`
- Implement Markdown and TXT file parsing
- Add file validation (type, size limits)
- Implement chunking for large documents
- Add extraction progress tracking

**Frontend Upload Experience:**
- Enhance drag-and-drop with file preview
- Add upload progress with percentage
- Implement multi-file upload queue
- Show extraction status in real-time
- Add retry mechanism for failures

### Week 4: Folder Integration & Polish
**Integration Tasks:**
- Connect existing `HomeLeftSidebar` to backend
- Modify `workspaceStore.uploadDocument` to accept `folderId`
- Update Firestore queries to filter by folder
- Implement folder creation and management
- Add document move between folders

**Citation System:**
- Create Milkdown plugin for :::source[...] syntax
- Render citations as interactive elements
- Add hover tooltips showing source text
- Style citations for visual distinction
- Test with all three lens types

## Phase 2: Lens Ecosystem (Weeks 5-8)

### Week 5: Scholar & Speed Lenses
**New Lens Types:**
- Implement Scholar Lens with academic formatting
- Add bibliography generation from citations
- Create Speed Lens for executive summaries
- Add lens quality validation
- Implement lens regeneration capability

**Performance Optimization:**
- Cache generated lenses in Firestore
- Implement incremental lens updates
- Add cost tracking per generation
- Optimize Gemini API calls

### Week 6: Custom Lens Builder
**Frontend Features:**
- Build custom lens creation modal
- Add prompt template editor with examples
- Implement prompt validation and safety checks
- Create lens preview before saving
- Add custom lens management interface

**Backend Implementation:**
- Create `/lens-templates` collection
- Implement `runCustomLens` callable function
- Add prompt injection protection
- Store user templates with permissions
- Track custom lens usage

### Week 7: Dynamic Focus Control
**MVP Implementation:**
- Add "Refine" button for selected text
- Create expansion modal with context
- Implement surrounding text extraction
- Generate focused explanations
- Add to reading history

**Future Prep:**
- Design granularity slider UI
- Plan multi-level generation strategy
- Consider caching implications

### Week 8: Testing & Optimization
**Quality Assurance:**
- Unit tests for lens generation
- Integration tests for full pipeline
- Load testing with concurrent users
- Performance profiling and optimization
- Security audit of custom prompts

**Launch Preparation:**
- Fix critical bugs
- Optimize bundle size
- Add analytics tracking
- Prepare documentation
- Beta user onboarding

## Phase 3: Collaboration Features (Weeks 9-12)

### Week 9: Document Sharing
**Sharing Implementation:**
- Add `sharedWith` array to documents
- Update security rules for shared access
- Create share dialog with permissions
- Implement share link generation
- Add shared documents view

### Week 10: Lens Library
**Public Templates:**
- Make lens templates shareable
- Create template marketplace UI
- Add rating and review system
- Implement template categories
- Track popular templates

### Week 11: Export & Versioning
**Export Features:**
- PDF generation from any lens
- DOCX export with formatting
- Markdown export option
- Implement version history
- Add diff view for changes

### Week 12: Polish & Launch
**Final Tasks:**
- Complete user testing
- Fix remaining bugs
- Optimize performance
- Update documentation
- Marketing site launch

## Phase 4: Intelligence Layer (Months 4-6)

### Month 4: Analytics & Learning
**Features:**
- Reading pattern tracking
- Comprehension analytics
- Learning recommendations
- Progress dashboards
- Study session insights

### Month 5: Advanced AI
**Capabilities:**
- Multi-document synthesis
- Question-answering system
- Smart summarization
- Cross-reference detection
- Topic extraction

### Month 6: Enterprise & Scale
**Enterprise Features:**
- Team workspaces
- SSO integration
- Admin controls
- Usage analytics
- SLA monitoring

## Technical Milestones

### Performance Targets
- Steel thread working: Day 5
- Three core lenses: Week 2
- <30s processing for 50-page PDF
- <2s first meaningful paint
- 99.9% uptime

### Cost Projections
- Gemini API: ~$0.10 per document
- Cloud Run: ~$50/month at launch
- Firestore: ~$100/month for 10k users
- Storage: ~$25/month for documents

### Security Checkpoints
- Week 1: Basic authentication working
- Week 3: File validation complete
- Week 6: Prompt sanitization implemented
- Week 8: Security audit passed
- Week 12: Penetration testing

## Risk Mitigation

### Technical Risks
- **Gemini API rate limits**: Implement queuing and backoff
- **Cost overruns**: Add usage quotas and monitoring
- **Scaling issues**: Use Cloud Run autoscaling
- **Data loss**: Enable Firestore backups

### Mitigation Strategies
- Deploy incrementally with feature flags
- Monitor costs daily with alerts
- Load test before each phase
- Keep 30-day backup retention

## Success Metrics

### Week 1 (Steel Thread)
- ✓ PDF upload to lens display working
- ✓ <60s end-to-end processing
- ✓ Real-time UI updates
- ✓ Basic error handling

### Month 1 (MVP)
- ✓ 3 core lenses generating
- ✓ Folder organization working
- ✓ Citation system implemented
- ✓ 100 beta users onboarded

### Month 3 (Platform)
- ✓ Custom lenses created by users
- ✓ Documents shared between users
- ✓ 1,000 active users
- ✓ <$0.20 cost per document

### Month 6 (Scale)
- ✓ 10,000 active users
- ✓ 100,000 documents processed
- ✓ 99.9% uptime achieved
- ✓ Enterprise customers onboarded

## Conclusion
This plan delivers a working product in Week 1 through the steel thread approach, then systematically builds toward a comprehensive platform. By following the resilient architecture and focusing on user value at each phase, grasp.now will transform how people interact with documents.