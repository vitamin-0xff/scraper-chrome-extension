export const cleanUpString = (input: string): string => {
  return input.replace(/(\s+|\\n)/g, ' ').replace(/(\\t)/, '').trim();
}