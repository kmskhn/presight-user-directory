import type { CursorPayload } from '../modules/users/users.types.js';

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    const parsed = JSON.parse(json) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'sortValue' in parsed &&
      'id' in parsed &&
      typeof (parsed as CursorPayload).id === 'number'
    ) {
      return parsed as CursorPayload;
    }
    return null;
  } catch {
    return null;
  }
}
