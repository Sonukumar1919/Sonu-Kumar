/**
 * Compress an image file from the device gallery to a lightweight base64 string
 * to ensure fast uploads, snappy previews, and Firestore document size compliance (<500KB).
 */
export async function compressAndReadImageFile(file: File, maxWidth = 900, maxHeight = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw and compress to JPEG or WEBP
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('इमेज लोड करने में समस्या आई।'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('फ़ाइल पढ़ने में समस्या आई।'));
    reader.readAsDataURL(file);
  });
}
