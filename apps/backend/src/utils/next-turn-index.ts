export function nextTurnIndex(current: number, arrayLength: number) {
  return (current + 1) % arrayLength;
}
