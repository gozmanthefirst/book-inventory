export const copyToClipboard = async (text: string) => {
  return await navigator.clipboard.writeText(text);
};

export const pasteFromClipboard = async () => {
  return await navigator.clipboard.readText();
};
