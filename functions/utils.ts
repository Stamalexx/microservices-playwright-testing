/**
 * Removes non-numeric characters from a string and converts it to a number.
 * * @param mixedString - The string containing currency or symbols (e.g., "$19.99")
 * @returns The extracted numeric value as a float
 */

export function removesNonDigits(mixedString: string): number {
  // Use Regex to remove anything that isn't a digit or a decimal point
  const numericString = mixedString.replace(/[^0-9.]/g, "");
  const number: number = parseFloat(numericString) || 0; //or 0
  return number;
}
