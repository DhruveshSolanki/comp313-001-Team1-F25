import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ffSearch' })
export class FfSearchPipe implements PipeTransform {
  transform<T extends Record<string, any>>(items: T[] | null | undefined, query: string | null | undefined): T[] {
    if (!items || !Array.isArray(items)) return [];
    const q = (query || '').trim().toLowerCase();
    if (!q) return items;

    return items.filter(item => {
      // Prefer common name keys; fallback to stringifying
      const name = (item['name'] ?? item['itemName'] ?? '').toString().toLowerCase();
      const category = (item['category'] ?? '').toString().toLowerCase();
      const ingredients = (item['ingredients'] ?? '').toString().toLowerCase();

      // startsWith on name for prefix searching, with contains fallbacks
      return (
        (name && name.startsWith(q)) ||
        (name && name.includes(q)) ||
        (category && category.includes(q)) ||
        (ingredients && ingredients.includes(q))
      );
    });
  }
}