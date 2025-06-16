// File validation utilities for document uploads

export interface FileValidationConfig {
  maxSize: number;
  allowedTypes: string[];
  allowedExtensions: string[];
  maxFiles?: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export const DEFAULT_CONFIG: FileValidationConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'application/rtf'
  ],
  allowedExtensions: ['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf'],
  maxFiles: 10
};

export const MIME_TYPE_MAP: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'application/rtf': ['.rtf'],
  // Fallback for files without proper MIME types
  '': ['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf']
};

export function validateFile(file: File, config: FileValidationConfig = DEFAULT_CONFIG): ValidationResult {
  const warnings: string[] = [];

  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    const fileSizeMB = Math.round(file.size / (1024 * 1024));
    return {
      isValid: false,
      error: `File "${file.name}" is too large (${fileSizeMB}MB). Maximum size is ${maxSizeMB}MB.`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: `File "${file.name}" is empty.`
    };
  }

  // Get file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  // Check file extension
  if (!config.allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File type "${extension}" is not supported. Allowed types: ${config.allowedExtensions.join(', ')}`
    };
  }

  // Check MIME type if available
  if (file.type && !config.allowedTypes.includes(file.type)) {
    // Check if the extension matches the MIME type
    const expectedExtensions = MIME_TYPE_MAP[file.type];
    if (!expectedExtensions?.includes(extension)) {
      warnings.push(`File "${file.name}" has unexpected MIME type "${file.type}" for extension "${extension}"`);
    }
  }

  // Check for suspicious file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      isValid: false,
      error: `File name "${file.name}" contains invalid characters.`
    };
  }

  // Warn about very long file names
  if (file.name.length > 100) {
    warnings.push(`File name "${file.name}" is very long (${file.name.length} characters). Consider shortening it.`);
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

export function validateFiles(files: File[], config: FileValidationConfig = DEFAULT_CONFIG): ValidationResult {
  // Check number of files
  if (config.maxFiles && files.length > config.maxFiles) {
    return {
      isValid: false,
      error: `Too many files selected (${files.length}). Maximum is ${config.maxFiles} files.`
    };
  }

  // Check total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeLimit = config.maxSize * Math.min(files.length, 5); // Allow up to 5x the individual limit for batch uploads
  
  if (totalSize > totalSizeLimit) {
    const totalSizeMB = Math.round(totalSize / (1024 * 1024));
    const limitMB = Math.round(totalSizeLimit / (1024 * 1024));
    return {
      isValid: false,
      error: `Total size of all files (${totalSizeMB}MB) exceeds the limit (${limitMB}MB).`
    };
  }

  // Validate individual files
  const warnings: string[] = [];
  for (const file of files) {
    const result = validateFile(file, config);
    if (!result.isValid) {
      return result;
    }
    if (result.warnings) {
      warnings.push(...result.warnings);
    }
  }

  // Check for duplicate file names
  const fileNames = files.map(f => f.name);
  const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];
    warnings.push(`Duplicate file names detected: ${uniqueDuplicates.join(', ')}`);
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileTypeFromExtension(fileName: string): string {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case '.pdf':
      return 'PDF Document';
    case '.docx':
      return 'Word Document';
    case '.doc':
      return 'Word Document (Legacy)';
    case '.txt':
      return 'Text File';
    case '.md':
      return 'Markdown File';
    case '.rtf':
      return 'Rich Text Format';
    default:
      return 'Unknown File Type';
  }
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isTextFile(file: File): boolean {
  return file.type.startsWith('text/') || 
         file.name.endsWith('.md') || 
         file.name.endsWith('.txt');
}

export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.endsWith('.pdf');
}

export function isWordFile(file: File): boolean {
  return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
         file.type === 'application/msword' ||
         file.name.endsWith('.docx') ||
         file.name.endsWith('.doc');
}