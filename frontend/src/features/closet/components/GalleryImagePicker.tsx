// GalleryImagePicker.tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export interface GalleryImagePickerProps {
  onImagesSelected: (images: string[]) => void;
  camera?: boolean; // <-- NEW
}

export interface GalleryImagePickerRef {
  open: () => void;
}

const GalleryImagePicker = forwardRef<GalleryImagePickerRef, GalleryImagePickerProps>(
  ({ onImagesSelected, camera = false }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => inputRef.current?.click(),
    }));

    return (
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        multiple={!camera}                  // camera: single shot UX
        accept="image/*"
        // This `capture` attribute prompts camera intents on Android
        // (iOS ignores it and still shows its own native sheet if used)
        {...(camera ? { capture: 'environment' } : {})}   // <-- NEW
        onChange={e => {
          const files = Array.from(e.target.files || []);
          const readers = files.map(file => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }));
          Promise.all(readers).then(images => onImagesSelected(images));
        }}
      />
    );
  }
);

export default GalleryImagePicker;
