import { Injectable } from '@angular/core';

export interface PreloadResult {
  url: string;
  success: boolean;
  image?: HTMLImageElement;
}

@Injectable({
  providedIn: 'root'
})
export class ImagePreloaderService {
  private preloadedImages = new Map<string, HTMLImageElement>();
  private preloadPromises = new Map<string, Promise<PreloadResult>>();

  constructor() { }

  /**
   * Preload a single image
   */
  preloadImage(url: string): Promise<PreloadResult> {
    // Return cached promise if already preloading
    if (this.preloadPromises.has(url)) {
      return this.preloadPromises.get(url)!;
    }

    // Return success if already preloaded
    if (this.preloadedImages.has(url)) {
      return Promise.resolve({
        url,
        success: true,
        image: this.preloadedImages.get(url)
      });
    }

    const promise = new Promise<PreloadResult>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.set(url, img);
        this.preloadPromises.delete(url);
        resolve({
          url,
          success: true,
          image: img
        });
      };

      img.onerror = () => {
        this.preloadPromises.delete(url);
        resolve({
          url,
          success: false
        });
      };

      // Start loading
      img.src = url;
    });

    this.preloadPromises.set(url, promise);
    return promise;
  }

  /**
   * Preload multiple images with progress tracking
   */
  preloadImages(urls: string[]): Promise<{
    results: PreloadResult[];
    successCount: number;
    totalCount: number;
  }> {
    const uniqueUrls = [...new Set(urls.filter(url => url && url.trim()))];
    
    if (uniqueUrls.length === 0) {
      return Promise.resolve({
        results: [],
        successCount: 0,
        totalCount: 0
      });
    }

    const promises = uniqueUrls.map(url => this.preloadImage(url));

    return Promise.all(promises).then(results => {
      const successCount = results.filter(result => result.success).length;
      
      return {
        results,
        successCount,
        totalCount: uniqueUrls.length
      };
    });
  }

  /**
   * Preload images with progress callback
   */
  preloadImagesWithProgress(
    urls: string[], 
    progressCallback?: (loaded: number, total: number, currentUrl?: string) => void
  ): Promise<{
    results: PreloadResult[];
    successCount: number;
    totalCount: number;
  }> {
    const uniqueUrls = [...new Set(urls.filter(url => url && url.trim()))];
    
    if (uniqueUrls.length === 0) {
      return Promise.resolve({
        results: [],
        successCount: 0,
        totalCount: 0
      });
    }

    let completed = 0;
    const results: PreloadResult[] = [];
    
    const promises = uniqueUrls.map(async (url, index) => {
      try {
        const result = await this.preloadImage(url);
        results[index] = result;
        completed++;
        
        if (progressCallback) {
          progressCallback(completed, uniqueUrls.length, url);
        }
        
        return result;
      } catch (error) {
        const errorResult: PreloadResult = { url, success: false };
        results[index] = errorResult;
        completed++;
        
        if (progressCallback) {
          progressCallback(completed, uniqueUrls.length, url);
        }
        
        return errorResult;
      }
    });

    return Promise.all(promises).then(results => {
      const successCount = results.filter(result => result.success).length;
      
      return {
        results,
        successCount,
        totalCount: uniqueUrls.length
      };
    });
  }

  /**
   * Check if an image is already preloaded
   */
  isImagePreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  /**
   * Get a preloaded image
   */
  getPreloadedImage(url: string): HTMLImageElement | null {
    return this.preloadedImages.get(url) || null;
  }

  /**
   * Clear preloaded images to free memory
   */
  clearPreloadedImages(): void {
    this.preloadedImages.clear();
    this.preloadPromises.clear();
  }

  /**
   * Get preloading statistics
   */
  getStats(): { preloadedCount: number; pendingCount: number } {
    return {
      preloadedCount: this.preloadedImages.size,
      pendingCount: this.preloadPromises.size
    };
  }
}
