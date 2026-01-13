import { CURRENCY } from './constants';

/**
 * Format price with Swiss CHF formatting: CHF 1'299.00
 */
export function formatPrice(price: number | string, currency = CURRENCY): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return `${currency} 0.00`;

  const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `${currency} ${formatted}`;
}

/**
 * Format date to locale string
 */
export function formatDate(
  date: string | Date,
  locale = 'de-CH',
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, options || { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date, locale = 'de-CH'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generate Cloudinary image URL
 */
export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {},
): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dzyyygr1x';
  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  transforms.push('f_auto', 'q_auto');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
