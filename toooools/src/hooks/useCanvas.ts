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

  const setupCanvas = useCallback((img: HTMLImageElement, maxWidth = 800) => {
    const canvas = sourceCanvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (!canvas) return { width: 0, height: 0 };

    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = (maxWidth / width) * height;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    if (tempCanvas) {
      tempCanvas.width = width;
      tempCanvas.height = height;
    }

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);

    return { width, height };
  }, []);

  const renderEffect = useCallback((
    effectName: EffectName,
    params: EffectParams
  ) => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    const originalImg = originalImageRef.current;
    if (!sourceCanvas || !outputCanvas || !originalImg) return;

    outputCanvas.width = sourceCanvas.width;
    outputCanvas.height = sourceCanvas.height;

    const srcCtx = sourceCanvas.getContext('2d')!;

    srcCtx.drawImage(originalImg, 0, 0, sourceCanvas.width, sourceCanvas.height);

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
    setupCanvas,
    renderEffect,
    exportCanvas,
  };
}