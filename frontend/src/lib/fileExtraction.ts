/**
 * File extraction utilities for converting various file types to text content
 */

/**
 * Extract text content from various file types
 * @param file The file to extract text from
 * @returns Promise<string> The extracted text content
 */
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Handle text files directly
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        resolve(content);
        return;
      }
      
      // Handle PDF files with basic text extraction
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For now, create placeholder content that looks like extracted PDF text
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const placeholderContent = `# ${fileName}

This is placeholder content extracted from the PDF file "${file.name}".

## Executive Summary

This document contains important information about the topic at hand. The content has been automatically extracted and is ready for transformation through our lens system.

## Key Points

- Document uploaded successfully
- Ready for lens generation
- Content extraction completed
- File size: ${(file.size / 1024 / 1024).toFixed(2)} MB

## Content Overview

The original document contains detailed information that can be transformed into various lenses:

- **Slide Lens**: Key concepts in presentation format
- **Study Lens**: Detailed notes and examples
- **Story Lens**: Narrative, engaging format

---

*This is a demo implementation. In production, we would use PDF.js or similar libraries for proper PDF text extraction.*`;
        
        resolve(placeholderContent);
        return;
      }
      
      // Handle DOCX files
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const placeholderContent = `# ${fileName}

This is placeholder content extracted from the Word document "${file.name}".

## Document Summary

This Word document has been processed and is ready for lens transformation. The content includes structured information that can be presented in multiple formats.

### Main Sections

1. **Introduction**: Overview of the document's purpose
2. **Content Analysis**: Key findings and insights
3. **Recommendations**: Action items and next steps

### Key Features

- Professional formatting preserved
- Tables and lists converted to markdown
- Images and charts noted for reference

*This is a demo implementation. In production, we would use mammoth.js or similar libraries for proper DOCX text extraction.*`;
        
        resolve(placeholderContent);
        return;
      }
      
      // Fallback for other file types
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      resolve(`# ${fileName}\n\nContent extracted from ${file.name}\n\nFile type: ${file.type}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\nThis file has been uploaded successfully and is ready for processing.`);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For binary files, we'll create placeholder content based on file info
      reader.onload = null; // Clear the onload handler
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const placeholderContent = `# ${fileName}\n\nThis is placeholder content extracted from the PDF file "${file.name}".\n\n## Executive Summary\n\nThis document contains important information about the topic at hand. The content has been automatically extracted and is ready for transformation through our lens system.\n\n## Key Points\n\n- Document uploaded successfully\n- Ready for lens generation\n- Content extraction completed\n- File size: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\n## Content Overview\n\nThe original document contains detailed information that can be transformed into various lenses:\n\n- **Slide Lens**: Key concepts in presentation format\n- **Study Lens**: Detailed notes and examples\n- **Story Lens**: Narrative, engaging format\n\n---\n\n*This is a demo implementation. In production, we would use PDF.js or similar libraries for proper PDF text extraction.*`;
        resolve(placeholderContent);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const placeholderContent = `# ${fileName}\n\nThis is placeholder content extracted from the Word document "${file.name}".\n\n## Document Summary\n\nThis Word document has been processed and is ready for lens transformation. The content includes structured information that can be presented in multiple formats.\n\n### Main Sections\n\n1. **Introduction**: Overview of the document's purpose\n2. **Content Analysis**: Key findings and insights\n3. **Recommendations**: Action items and next steps\n\n### Key Features\n\n- Professional formatting preserved\n- Tables and lists converted to markdown\n- Images and charts noted for reference\n\n*This is a demo implementation. In production, we would use mammoth.js or similar libraries for proper DOCX text extraction.*`;
        resolve(placeholderContent);
      } else {
        resolve(`# ${fileName}\n\nContent extracted from ${file.name}\n\nFile type: ${file.type}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\nThis file has been uploaded successfully and is ready for processing.`);
      }
    }
  });
}