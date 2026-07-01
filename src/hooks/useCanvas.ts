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
      const url = URL.createObjectURL(file);

      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.muted = true;
        video.onloadeddata = () => {
          video.currentTime = 0;
        };
        video.onseeked = () => {
          const c = document.createElement('canvas');
          c.width = video.videoWidth;
          c.height = video.videoHeight;
          c.getContext('2d')!.drawImage(video, 0, 0);
          URL.revokeObjectURL(url);
          const img = new Image();
          img.onload = () => {
            originalImageRef.current = img;
            resolve(img);
          };
          img.onerror = reject;
          img.src = c.toDataURL('image/png');
        };
        video.onerror = reject;
        video.src = url;
        video.load();
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            originalImageRef.current = img;
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const loadSample = useCallback((img: HTMLImageElement) => {
    originalImageRef.current = img;
  }, []);

  const renderEffect = useCallback((
    effectName: EffectName,
    params: EffectParams,
    outputSize?: number
  ) => {
    const sourceCanvas = sourceCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const originalImg = originalImageRef.current;
    if (!sourceCanvas || !outputCanvas || !originalImg) return;

    // Source canvas always at original resolution for processing
    sourceCanvas.width = originalImg.width;
    sourceCanvas.height = originalImg.height;
    if (tempCanvas) {
      tempCanvas.width = originalImg.width;
      tempCanvas.height = originalImg.height;
    }

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

    // Output canvas at target size (maintaining aspect ratio)
    let outW = originalImg.width;
    let outH = originalImg.height;
    if (outputSize && outputSize > 0) {
      const ratio = originalImg.width / originalImg.height;
      outW = outputSize;
      outH = Math.round(outputSize / ratio);
    }
    outputCanvas.width = outW;
    outputCanvas.height = outH;

    const outCtx = outputCanvas.getContext('2d')!;
    if (params.showEffect) {
      applyEffect(effectName, outCtx, sourceCanvas, params);
    } else {
      outCtx.drawImage(sourceCanvas, 0, 0, outW, outH);
    }
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