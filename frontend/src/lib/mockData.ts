/**
 * Mock data for development and testing
 */

import type { DocumentType } from '../types';

export const mockDocuments: DocumentType[] = [
  {
    id: '1',
    title: 'Product Strategy 2024',
    content: 'Our comprehensive product strategy for the upcoming year, focusing on user experience improvements and market expansion.',
    originalFileName: 'product-strategy-2024.pdf',
    fileType: 'application/pdf',
    fileSize: 2457600, // 2.4MB
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(Date.now() - 86400000),
    userId: 'temp-user',
    folderId: 'strategy',
    tags: ['strategy', 'product'],
    status: 'ready' as const,
    lenses: {
      slide: 'Generated slide content',
      study: 'Generated study content',
      story: 'Generated story content'
    },
    preview: 'Our comprehensive product strategy for the upcoming year, focusing on user experience improvements and market expansion.'
  },
  {
    id: '2',
    title: 'Market Analysis Report',
    content: 'Detailed analysis of current market trends and competitive landscape in the document management space.',
    originalFileName: 'market-analysis.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 1234567, // 1.2MB
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
    userId: 'temp-user',
    folderId: 'research',
    tags: ['research', 'market'],
    status: 'ready' as const,
    lenses: {
      study: 'Generated study content',
      story: 'Generated story content'
    },
    preview: 'Detailed analysis of current market trends and competitive landscape in the document management space.'
  }
];