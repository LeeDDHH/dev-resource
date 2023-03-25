export const handleEnterInputEvent = (e: React.KeyboardEvent<HTMLInputElement>, func: () => void) => {
  if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
  func();
};
