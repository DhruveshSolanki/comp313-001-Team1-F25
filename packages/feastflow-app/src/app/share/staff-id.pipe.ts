import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generates a human-friendly staff display ID like MGR901 from MongoDB _id and role.
 * Rule: prefix by role, number derived from a simple hash of the id to 100-999 range.
 */
@Pipe({ name: 'staffId' })
export class StaffIdPipe implements PipeTransform {
  private prefix(role: string): string {
    const map: Record<string, string> = {
      'MANAGER': 'MGR',
      'SYSTEM_MANAGER': 'SMG',
      'SERVER': 'SER',
      'KITCHEN_STAFF': 'KIT',
      'CHEF': 'CHF'
    };
    return map[role] || 'STA';
  }

  private toNumber(id: string): number {
    if (!id) return 100;
    // Simple hash: sum char codes
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    // Map to 100-999
    return (sum % 900) + 100;
  }

  transform(id: string, role: string): string {
    return `${this.prefix(role)}${this.toNumber(id)}`;
  }
}
