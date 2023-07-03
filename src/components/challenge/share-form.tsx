'use client';

export function ShareForm() {
  const url = window.location.href;
  const copyButton = document.getElementById('copy-button') as HTMLButtonElement;

  const copyToClipboard = async (): Promise<void> => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('bg-green-500');
      } catch {
        copyButton.textContent = 'Failed to copy';
        copyButton.classList.add('bg-green-500');
      }
    }
  };

  return (
    <div>
      <p>Copy this challenge url to share with your friends!</p>
      <button
        id="copy-button"
        className="ml-auto mt-4 block rounded-lg px-3 py-2 text-black duration-300 hover:scale-110 hover:rounded-2xl hover:duration-300 active:scale-95 active:rounded-md active:duration-75 dark:bg-white"
        onClick={() => void copyToClipboard}
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
