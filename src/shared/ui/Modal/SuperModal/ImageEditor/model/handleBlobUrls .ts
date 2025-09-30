import { Images } from '@/shared/lib/sсhemas/posts'

export const handleBlobUrls = {
  // Сохраняем blob URL как data URL
  async save(images: Images[]): Promise<Images[]> {
    const processedImages = await Promise.all(
      images.map(async (image) => {
        if (image.url.startsWith('blob:')) {
          try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const dataURL = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });

            return {
              ...image,
              url: dataURL,

            };
          } catch (error) {
            console.error('Failed to convert blob URL to data URL:', error);
            return image;
          }
        }
        return image;
      })
    );

    return processedImages;
  },

  // Восстанавливаем data URL обратно в blob URL
  async restore(images: Images[]): Promise<{ files: File[]; images: Images[] }> {
    const files: File[] = [];
    const restoredImages: Images[] = [];

    for (const image of images) {
      if (image.url.startsWith('data:')) {
        try {
          const file = this.dataURLtoFile(image.url, `image-${Date.now()}.jpg`);
          files.push(file);

          restoredImages.push({
            ...image,
            url: URL.createObjectURL(file),
            fileSize: file.size
          });
        } catch (error) {
          console.error('Failed to restore data URL:', error);
        }
      } else {
        // Для обычных URL
        restoredImages.push(image);
      }
    }

    return { files, images: restoredImages };
  },

  dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }
};