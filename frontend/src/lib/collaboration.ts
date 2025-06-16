/**
 * Collaboration service for real-time editing
 * This is a foundation for future collaborative editing features
 * When ready, this can be integrated with Y.js and @milkdown/plugin-collab
 */

import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface CollaborationCursor {
  userId: string;
  userName: string;
  position: number;
  selection?: {
    anchor: number;
    head: number;
  };
  lastSeen: Date;
}

export interface CollaborationSession {
  documentId: string;
  cursors: Map<string, CollaborationCursor>;
  isActive: boolean;
}

export class CollaborationService {
  private sessions = new Map<string, CollaborationSession>();
  private unsubscribers = new Map<string, () => void>();

  /**
   * Start a collaboration session for a document
   */
  async startSession(documentId: string, userId: string, userName: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      documentId,
      cursors: new Map(),
      isActive: true,
    };

    this.sessions.set(documentId, session);

    // Listen for real-time cursor updates (placeholder for future implementation)
    const docRef = doc(db, 'collaboration', documentId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Process cursor updates from other users
        this.processCursorUpdates(documentId, data.cursors || {});
      }
    });

    this.unsubscribers.set(documentId, unsubscribe);

    // Add current user cursor
    await this.updateCursor(documentId, {
      userId,
      userName,
      position: 0,
      lastSeen: new Date(),
    });

    return session;
  }

  /**
   * End a collaboration session
   */
  async endSession(documentId: string, userId: string): Promise<void> {
    const unsubscribe = this.unsubscribers.get(documentId);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribers.delete(documentId);
    }

    const session = this.sessions.get(documentId);
    if (session) {
      session.cursors.delete(userId);
      session.isActive = false;
      this.sessions.delete(documentId);
    }

    // Remove user cursor from Firestore
    try {
      const docRef = doc(db, 'collaboration', documentId);
      await updateDoc(docRef, {
        [`cursors.${userId}`]: null,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Failed to cleanup collaboration cursor:', error);
    }
  }

  /**
   * Update cursor position for a user
   */
  async updateCursor(documentId: string, cursor: CollaborationCursor): Promise<void> {
    const session = this.sessions.get(documentId);
    if (!session) return;

    session.cursors.set(cursor.userId, cursor);

    // Update in Firestore for other users to see
    try {
      const docRef = doc(db, 'collaboration', documentId);
      await updateDoc(docRef, {
        [`cursors.${cursor.userId}`]: {
          ...cursor,
          lastSeen: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Failed to update cursor position:', error);
    }
  }

  /**
   * Get active cursors for a document
   */
  getCursors(documentId: string): CollaborationCursor[] {
    const session = this.sessions.get(documentId);
    if (!session) return [];

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    return Array.from(session.cursors.values()).filter(
      cursor => cursor.lastSeen > fiveMinutesAgo
    );
  }

  /**
   * Check if a document has active collaborators
   */
  hasActiveCollaborators(documentId: string): boolean {
    return this.getCursors(documentId).length > 1;
  }

  /**
   * Process cursor updates from Firestore
   */
  private processCursorUpdates(documentId: string, cursors: Record<string, CollaborationCursor>): void {
    const session = this.sessions.get(documentId);
    if (!session) return;

    Object.entries(cursors).forEach(([userId, cursorData]) => {
      if (cursorData) {
        session.cursors.set(userId, {
          ...cursorData,
          lastSeen: cursorData.lastSeen || new Date(),
        });
      } else {
        session.cursors.delete(userId);
      }
    });
  }
}

// Singleton instance
export const collaborationService = new CollaborationService();

/**
 * React hook for collaboration features
 */
export function useCollaboration(documentId: string, userId: string, userName: string) {
  // This is a placeholder for future implementation
  // When implementing real collaborative editing:
  // 1. Use Y.js for operational transforms
  // 2. Integrate with @milkdown/plugin-collab
  // 3. Set up WebSocket or WebRTC for real-time sync
  // 4. Handle conflict resolution and user presence
  
  // Prevent unused variable warnings
  console.debug('Collaboration hook called for:', { documentId, userId, userName });

  return {
    cursors: [],
    isCollaborating: false,
    startCollaboration: async () => {
      console.log('Collaboration feature coming in Phase 3');
    },
    endCollaboration: async () => {
      // Cleanup
    },
  };
}