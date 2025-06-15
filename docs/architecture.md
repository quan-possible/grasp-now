# The Definitive MVP Architecture: Best of Everything

This architecture leverages your existing code, respects your constraints, and implements a resilient backend to power the full feature set.

#### 1. Guiding Principles
*   **Leverage Existing Code:** Don't rebuild what works. The folder management, auth, and UI shells are solid.
*   **Serverless & "Zero-Ops":** Use managed Firebase/GCP services to avoid server management.
*   **Decouple for Resilience:** Never let a long-running AI task depend on the user's browser session or a short-lived function.
*   **Cost-First Optimization:** Use the LLM cleverly to do more work in a single pass. Stay within free tiers.

#### 2. Core Technology Stack (Refined)
*   **Frontend:** React, Vite, TS, Zustand, Milkdown, Tailwind CSS *(No change, this is correct)*
*   **Authentication:** Firebase Authentication *(No change)*
*   **File Storage:** Cloud Storage for Firebase *(No change)*
*   **Database:** Cloud Firestore *(No change)*
*   **AI Pipeline:** **Cloud Functions (Trigger) → Pub/Sub (Queue) → Cloud Run Jobs (Worker)**
*   **LLM Provider:** **Google AI (Gemini 1.5 Pro)** via its API.

#### 3. Firestore Data Model (MVP Focus)

This is the target schema. It's simple and directly supports the existing `workspaceStore` and `editorStore`.

```typescript
// /users/{uid}
// ... (profile info)

// /folders/{folderId}
{
  ownerId: string,
  name: string,
  createdAt: Timestamp
}

// /documents/{docId}
{
  ownerId: string,
  folderId: string,
  fileName: string,
  storagePath: string,
  status: 'uploaded' | 'processing' | 'ready' | 'error',
  extractedText: string, // <-- CRUCIAL new field
  createdAt: Timestamp,
  
  // SUBCOLLECTION for lenses
  // /documents/{docId}/lenses/{lensId}
  {
    name: "Slide Lens", // or "My Custom Lens"
    status: 'pending' | 'generating' | 'complete',
    content: "<Markdown Content>", // The generated text
    promptUsed: "Explain this like..." // For custom lenses
  }
}
```
*Note: We are intentionally deferring the `citations` collection for the MVP and embedding citations directly in the `content` for simplicity.*

#### 4. The Critical Path: The AI Lens Pipeline (The Bridge)

This is the most important new component. It's how we get from your current state to a working product.

```mermaid
graph TD
    subgraph Client-Side (Existing Code)
        A[1. User uploads PDF via HomePage] -->|`workspaceStore.uploadDocument`| B(2. File saved to Cloud Storage);
    end

    subgraph Backend (New Implementation)
        B -->|Storage onFinalize Trigger| C(3. Cloud Function: `extractTextAndQueue`);
        C -->|Publishes {docId}| D(4. Pub/Sub Topic: `process-document`);
        D -->|Triggers Job| E(5. Cloud Run Job: `lens-generator`);
        E -->|Reads extractedText from Firestore| F(6. Calls Gemini API for ALL core lenses);
        E -->|Writes results back| G(7. Firestore: updates `lenses` subcollection);
    end

    subgraph Client-Side (Existing Code)
        G -->|`onSnapshot` listener| H(8. UI in MainContent updates in real-time);
    end
```

#### 5. Bridging the Gap: Actionable Implementation Steps

This is the concrete plan to build the pipeline on top of your existing code.

**Step 1: Backend Infrastructure Setup (1-2 hours)**
1.  In your GCP console, enable the **Pub/Sub API** and **Cloud Run API**.
2.  Create a Pub/Sub topic named `process-document`.
3.  Set up a new Cloud Run **Job** (not Service) named `lens-generator`. Configure it to be triggered by messages on the `process-document` topic.

**Step 2: Modify the Ingestion Flow (2-3 hours)**
1.  **Create a new Cloud Function** named `extractTextAndQueue`.
    *   **Trigger:** Cloud Storage `onFinalize` (when a new file is uploaded).
    *   **Logic:**
        1.  Get the file path from the event.
        2.  Download the file into the function's memory.
        3.  Use `pdf-parse` or `mammoth.js` to extract the raw text content.
        4.  **Update the Firestore `documents/{docId}` record:** Add the `extractedText` to it and set `status: 'processing'`.
        5.  Publish a message with the `{ docId }` to the `process-document` Pub/Sub topic.
        6.  This function is now done. It's fast and reliable.

**Step 3: Build the `lens-generator` Worker (4-6 hours)**
1.  This is the new Cloud Run Job. It's just a Node.js application in a container.
2.  **Logic:**
    1.  It receives the Pub/Sub message containing the `{ docId }`.
    2.  Fetches the document from Firestore to get the `extractedText`.
    3.  For each core lens (Slide, Study, Story), create a specific prompt.
    4.  **MVP Citation Hack:** Modify the prompt to offload citation work to the LLM. Example:
        > "You are an expert analyst. Transform the following text into a 'Study Lens'. It must be detailed notes with examples. **Crucially, for every piece of information you generate, you MUST add an inline citation marker referencing the original text by embedding it in a special component, like this: `:::source[The exact quoted text from the original document goes here.]`**. Do not summarize the source text inside the marker; quote it verbatim. Here is the text: `[...PASTE extractedText HERE...]`"
    5.  Run all three Gemini API calls **in parallel** (`Promise.all`).
    6.  As each promise resolves, write the resulting Markdown content directly to the `documents/{docId}/lenses/{lensId}` subcollection in Firestore and set its status to `'complete'`.
    7.  Once all lenses are generated, update the main `documents/{docId}` status to `'ready'`.

**Step 4: Frontend Integration (3-4 hours)**
1.  In `DocumentViewPage.tsx`, when a document is loaded, set up a **real-time Firestore listener** (`onSnapshot`) on the `documents/{docId}/lenses` subcollection.
2.  Push the results of this listener into your `editorStore`.
3.  The `MainContent.tsx` tab bar should be driven by the data in `editorStore`. As new lenses appear from the backend with `status: 'complete'`, the UI will update automatically, enabling the tabs.
4.  When a user clicks a tab, show the corresponding `content` in the `MilkdownEditor`.
5.  **Render Citations:** Create a simple Milkdown plugin or a Remark plugin that recognizes the `:::source[...]` custom syntax and renders it as a small, non-editable, highlighted block or an icon that shows the full source on hover. This is *vastly* simpler than an embedding-based system.

This architecture is the fastest, cheapest, and most robust path to your feature-rich MVP. It directly builds on your existing codebase, requires minimal new services, and cleverly solves complex problems like citations in a pragmatic, MVP-friendly way.