import { useRef, useCallback } from 'react';
import type { EffectName, EffectParams } from '../types';
import { applyEffect } from '../effects';
import { preprocessImage } from '../utils/imageProcessing';

export function useCanvas() {
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const loadImage = useCallback((file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          originalImageRef.current = img;
          resolve(img);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const loadSample = useCallback((img: HTMLImageElement) => {
    originalImageRef.current = img;
  }, []);

  const renderEffect = useCallback((
    effectName: EffectName,
    params: EffectParams
  ) => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const originalImg = originalImageRef.current;
    if (!sourceCanvas || !outputCanvas || !originalImg) return;

    // Ensure canvas matches original image dimensions
    sourceCanvas.width = originalImg.width;
    sourceCanvas.height = originalImg.height;
    if (tempCanvas) {
      tempCanvas.width = originalImg.width;
      tempCanvas.height = originalImg.height;
    }
    outputCanvas.width = originalImg.width;
    outputCanvas.height = originalImg.height;

    const srcCtx = sourceCanvas.getContext('2d')!;
    srcCtx.drawImage(originalImg, 0, 0);

    if (params.blur > 0) {
      const tempCanvas = tempCanvasRef.current;
      if (tempCanvas) {
        tempCanvas.width = sourceCanvas.width;
        tempCanvas.height = sourceCanvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.filter = `blur(${params.blur}px)`;
        tempCtx.drawImage(sourceCanvas, 0, 0);
        tempCtx.filter = 'none';
        srcCtx.drawImage(tempCanvas, 0, 0);
      }
    }

    preprocessImage(srcCtx, sourceCanvas.width, sourceCanvas.height, params);

    const outCtx = outputCanvas.getContext('2d')!;
    applyEffect(effectName, outCtx, sourceCanvas, params);
  }, []);

  const exportCanvas = useCallback((filename = 'export.png') => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
    sourceCanvasRef,
    outputCanvasRef,
    tempCanvasRef,
    loadImage,
    loadSample,
    renderEffect,
    exportCanvas,
  };
}