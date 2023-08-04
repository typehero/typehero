/**
 * This will paste the given text into the textarea element
 */
export function insertText(newText: string, textarea: HTMLTextAreaElement) {
  // make sure it's selected when we go to pasta
  textarea.focus();

  let pasted = true;
  try {
    if (!document.execCommand('insertText', false, newText)) {
      pasted = false;
    }
  } catch (e) {
    console.error('error caught:', e);
    pasted = false;
  }

  if (!pasted) {
    console.error('paste unsuccessful, execCommand not supported');
  }

  return pasted;
}
