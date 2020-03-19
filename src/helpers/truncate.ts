/**
 * Truncate string to `max` number of characters.
 *
 * @param value  Value to truncate.
 * @param max Maximum number of characters.
 */
export function truncate(value: string, max = 50) {
  if (!value || value.length <= max) {
    return value;
  }

  return `${value.substring(0, max)}...`;
}
