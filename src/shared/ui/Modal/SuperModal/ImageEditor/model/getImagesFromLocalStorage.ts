import { Image } from '@/shared/lib/sсhemas/posts'

export const createFilesFromLocalStorage = async (file:Image[]) => {


  try {
    const images: Image[] = file;
    const files: File[] = [];

    for (const image of images) {
      if (image.url && image.url.startsWith('http')) {
        try {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          files.push(file);
        } catch (error) {
          console.warn('Failed to create file from URL:', image.url);
        }
      }
    }

    return files;
  } catch (error) {
    console.error('Error creating files from localStorage:', error);
    return [];
  }
};