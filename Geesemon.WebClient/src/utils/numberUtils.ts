export const range = (start: number, end: number) => {
  const mylength = end - start + 1;
  return Array.from({ length: mylength }, (_, i) => start + i);
};