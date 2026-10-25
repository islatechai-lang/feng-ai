/**
 * Compresses an image file in the browser using HTML Canvas.
 * Handles resizing to max dimension (e.g. 1536px) and re-encoding to JPEG.
 */
export async function compressImage(
  file: File,
  maxDimension: number = 1536,
  quality: number = 0.85
): Promise<{ dataUrl: string; blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get 2D canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob, width, height });
            } else {
              reject(new Error("Canvas blob conversion failed"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
