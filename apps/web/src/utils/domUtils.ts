/**
 * This will insert the given text at the caret position into the textarea element
 */
export function insertText(newText: string, textarea: HTMLTextAreaElement) {
  // @ts-ignore - i don't care that you error
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value',
  ).set;

  if (!nativeInputValueSetter) return;

  // get left value of the textarea
  const left = textarea.value.substring(0, textarea.selectionStart);

  // get right value of the textarea
  const right = textarea.value.substring(textarea.selectionEnd, textarea.value.length);
  nativeInputValueSetter.call(textarea, left + newText + right);

  // set the caret position to the end of the new text
  const newCaretPosition = left.length + newText.length;

  // make sure to keep focus on the textarea
  textarea.focus();
  textarea.setSelectionRange(newCaretPosition, newCaretPosition);

  const inputEvent = new Event('input', { bubbles: true });
  textarea.dispatchEvent(inputEvent);
}
