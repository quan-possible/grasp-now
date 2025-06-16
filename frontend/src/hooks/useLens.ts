import { useState, useCallback, useMemo } from 'react';
import { Document } from '../types';
import { LensService, LensType, LensDefinition } from '../lib/lensService';

interface UseLensReturn {
  selectedLens: LensType;
  lensContent: string;
  availableLenses: LensDefinition[];
  isLensAvailable: (lensType: LensType) => boolean;
  selectLens: (lensType: LensType) => void;
  updateLensContent: (content: string) => void;
  getLensDefinition: (lensType: LensType) => LensDefinition;
}

export function useLens(document: Document | null, initialLens: LensType = 'slide'): UseLensReturn {
  const [selectedLens, setSelectedLens] = useState<LensType>(initialLens);
  const [lensContentCache, setLensContentCache] = useState<Record<string, string>>({});

  // Get current lens content
  const lensContent = useMemo(() => {
    if (!document) return '';
    
    // Check cache first
    const cacheKey = `${document.id}-${selectedLens}`;
    if (lensContentCache[cacheKey]) {
      return lensContentCache[cacheKey];
    }
    
    // Get from document or generate
    return LensService.getLensContent(document, selectedLens);
  }, [document, selectedLens, lensContentCache]);

  // Get available lenses
  const availableLenses = useMemo(() => {
    return LensService.getAllLenses();
  }, []);

  // Check if lens is available
  const isLensAvailable = useCallback((lensType: LensType) => {
    return LensService.isLensAvailable(lensType);
  }, []);

  // Select a lens
  const selectLens = useCallback((lensType: LensType) => {
    if (isLensAvailable(lensType)) {
      setSelectedLens(lensType);
    }
  }, [isLensAvailable]);

  // Update lens content
  const updateLensContent = useCallback((content: string) => {
    if (!document) return;
    
    // Update cache
    const cacheKey = `${document.id}-${selectedLens}`;
    setLensContentCache(prev => ({
      ...prev,
      [cacheKey]: content
    }));

    // In real app, this would update the document store and Firestore
    // For now, we just log it
    console.log(`Updated ${selectedLens} lens content for document ${document.id}`);
  }, [document, selectedLens]);

  // Get lens definition
  const getLensDefinition = useCallback((lensType: LensType) => {
    return LensService.LENS_DEFINITIONS[lensType];
  }, []);

  return {
    selectedLens,
    lensContent,
    availableLenses,
    isLensAvailable,
    selectLens,
    updateLensContent,
    getLensDefinition
  };
}