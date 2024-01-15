/**
 * This will paste the given text into the textarea element
 */
export function insertText(newText: string, textarea: HTMLTextAreaElement) {
  // Get the current cursor position
  const cursorPos = textarea.selectionStart;

  // Get the text before and after the cursor position
  const textBefore = textarea.value.substring(0, cursorPos);
  const textAfter = textarea.value.substring(cursorPos);

  // Insert the new text at the cursor position
  textarea.value = textBefore + newText + textAfter;

  // Move the cursor to the end of the inserted text
  const newCursorPos = cursorPos + newText.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);

  // Optionally, trigger the input event to update any event listeners
  const inputEvent = new Event('input');
  textarea.dispatchEvent(inputEvent);
}
