import type { DocumentType } from '../types';

export type LensType = 'slide' | 'study' | 'story' | 'scholar' | 'speed' | 'faq';

export interface LensDefinition {
  id: LensType;
  name: string;
  description: string;
  icon: string;
  status: 'available' | 'generating' | 'locked';
  phase: 1 | 2;
}

export interface LensContent {
  type: LensType;
  content: string;
  lastModified: Date;
  version: number;
}

// Lens definitions with metadata
export const LENS_DEFINITIONS: Record<LensType, LensDefinition> = {
  slide: {
    id: 'slide',
    name: 'Lecture Slides',
    description: 'Key points in presentation format',
    icon: 'Presentation',
    status: 'available',
    phase: 1
  },
  study: {
    id: 'study',
    name: 'Detailed Notes',
    description: 'In-depth study guide with examples',
    icon: 'BookOpen',
    status: 'available',
    phase: 1
  },
  story: {
    id: 'story',
    name: 'Economist Article',
    description: 'Narrative magazine-style format',
    icon: 'Newspaper',
    status: 'available',
    phase: 1
  },
  scholar: {
    id: 'scholar',
    name: 'Academic Outline',
    description: 'Formal academic structure',
    icon: 'GraduationCap',
    status: 'locked',
    phase: 2
  },
  speed: {
    id: 'speed',
    name: 'Quick Summary',
    description: 'Executive summary format',
    icon: 'Zap',
    status: 'locked',
    phase: 2
  },
  faq: {
    id: 'faq',
    name: 'FAQ Sheet',
    description: 'Questions and answers format',
    icon: 'FileQuestion',
    status: 'locked',
    phase: 2
  }
};

export class LensService {
  // Generate initial lens content based on document
  static generateLensContent(document: DocumentType, lensType: LensType): string {
    const baseTitle = document.title;
    
    switch (lensType) {
      case 'slide':
        return `# ${baseTitle}

## 📊 Slide Lens - Key Points

### Main Concepts
- **Core Concept 1**: Primary insight from the document
- **Core Concept 2**: Secondary important principle  
- **Core Concept 3**: Practical application or implication

### Key Takeaways
- [ ] Review and understand concept 1
- [ ] Practice applying concept 2
- [ ] Explore further implications of concept 3

### Discussion Points
1. How do these concepts relate to existing knowledge?
2. What are the practical applications?
3. What questions remain unanswered?

---

*This slide view is optimized for presentation and quick reference. Use the formatting tools above to customize the content for your needs.*`;

      case 'study':
        return `# ${baseTitle}

## 📚 Study Lens - Comprehensive Analysis

### Learning Objectives
After studying this document, you will understand:
1. **Primary concepts** and their foundational principles
2. **Practical applications** and real-world implementations
3. **Related terminology** and key vocabulary
4. **Critical thinking** approaches to the subject matter

### Detailed Analysis

#### Section 1: Introduction & Context
**Key Definition**: *[Add important term definitions here]*

**Background Information**: This section provides the historical context and foundational knowledge necessary to understand the main concepts.

#### Section 2: Core Principles
**Principle A**: Detailed explanation with supporting evidence and examples.
- Example 1: [Add specific example]
- Example 2: [Add another example]
- Related concepts: [List related ideas]

**Principle B**: Extended discussion with practical applications.
- Case study: [Add relevant case study]
- Implementation: [Describe how to apply]
- Common pitfalls: [List things to avoid]

### Study Questions
1. What are the fundamental principles discussed in this document?
2. How do these concepts apply in practical scenarios?
3. What are the strengths and limitations of the approaches presented?
4. How do these ideas connect to other concepts you've learned?

### Further Reading
- [Add relevant resources]
- [Add additional materials for deeper understanding]

---

*This study view is designed for comprehensive learning and retention. Add your own notes and examples using the editor above.*`;

      case 'story':
        return `# ${baseTitle}

## 📖 Story Lens - Narrative Exploration

### The Journey Begins

In a world where information flows like rivers converging into an ocean of knowledge, our story unfolds with a simple yet profound question: *How do we transform the way we understand and interact with complex ideas?*

### Setting the Scene

Picture yourself standing at the crossroads of traditional learning and innovative approaches. The document before you isn't just a collection of facts and figures—it's a gateway to a new way of seeing the world.

### The Characters

**The Concepts**: Like protagonists in our narrative, each main idea has its own personality and role to play. They interact, conflict, and ultimately work together to create a coherent understanding.

**The Reader**: You, the explorer, bringing your own experiences and perspectives to this intellectual journey.

**The Context**: The broader environment in which these ideas exist and evolve.

### The Plot Unfolds

#### Act I: Discovery
Our journey begins with the recognition that traditional approaches may not be sufficient for the challenges we face. There's a growing awareness that new perspectives are needed.

#### Act II: Exploration
As we delve deeper, we encounter various approaches and methodologies. Some prove more effective than others. We learn through trial, error, and gradual understanding.

#### Act III: Integration
Finally, the pieces begin to come together. We see how different elements connect and support each other, forming a coherent whole that's greater than the sum of its parts.

### The Resolution

What started as a simple exploration has become a transformation—not just of our understanding, but of our entire approach to learning and problem-solving.

### Epilogue: Looking Forward

The story doesn't end here. Like all good narratives, it opens up new questions and possibilities for future exploration.

---

*This narrative view transforms complex concepts into an engaging story format. Edit above to add your own perspective and insights.*`;

      default:
        return `# ${baseTitle}

This lens is coming in Phase 2 of the development. 

In the meantime, you can:
- Use the **Slide Lens** for key points and presentations
- Use the **Study Lens** for comprehensive learning materials  
- Use the **Story Lens** for narrative-style exploration

Stay tuned for more lens types in future updates!`;
    }
  }

  // Get lens content from document or generate if missing
  static getLensContent(document: DocumentType, lensType: LensType): string {
    // Check if lens content exists in document
    if (document.lenses && document.lenses[lensType]) {
      return document.lenses[lensType] || '';
    }

    // Generate content if missing
    return this.generateLensContent(document, lensType);
  }

  // Update lens content in document (in real app, this would update Firestore)
  static updateLensContent(document: DocumentType, lensType: LensType, content: string): DocumentType {
    const updatedDocument = {
      ...document,
      lenses: {
        ...document.lenses,
        [lensType]: content
      },
      updatedAt: new Date()
    };

    // In real implementation, this would:
    // 1. Update Firestore document
    // 2. Trigger any necessary re-indexing
    // 3. Update local cache
    console.log(`Updated ${lensType} lens for document ${document.id}`);
    
    return updatedDocument;
  }

  // Get available lenses for current phase
  static getAvailableLenses(): LensDefinition[] {
    return Object.values(LENS_DEFINITIONS).filter(lens => lens.phase === 1);
  }

  // Get all lenses (including locked ones)
  static getAllLenses(): LensDefinition[] {
    return Object.values(LENS_DEFINITIONS);
  }

  // Check if lens is available
  static isLensAvailable(lensType: LensType): boolean {
    return LENS_DEFINITIONS[lensType].status === 'available';
  }
}