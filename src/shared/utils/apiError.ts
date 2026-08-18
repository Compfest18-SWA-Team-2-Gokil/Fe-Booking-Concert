import axios from 'axios';

/**
 * Extracts the backend's `{"error": "..."}` message from an axios error.
 * Falls back to a caller-supplied message when the error isn't a
 * recognizable axios response error (network failure, non-axios throw, etc).
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return fallback;
}
