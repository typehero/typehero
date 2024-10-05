'use client';

import { X } from '@repo/ui/icons';
import { useState } from 'react';

export default function WalletConnectBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-4 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out">
      <div className="flex items-start p-4">
        <div className="mr-4 flex-shrink-0">
          <svg
            className="h-10 w-10"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="20" fill="#FFA500" />
            <path
              d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM23.5 21.5H20.5V24.5C20.5 25.05 20.05 25.5 19.5 25.5C18.95 25.5 18.5 25.05 18.5 24.5V21.5H15.5C14.95 21.5 14.5 21.05 14.5 20.5C14.5 19.95 14.95 19.5 15.5 19.5H18.5V16.5C18.5 15.95 18.95 15.5 19.5 15.5C20.05 15.5 20.5 15.95 20.5 16.5V19.5H23.5C24.05 19.5 24.5 19.95 24.5 20.5C24.5 21.05 24.05 21.5 23.5 21.5Z"
              fill="#4CAF50"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <h2 className="text-lg font-bold text-gray-900">Connect your wallet</h2>
          <p className="text-sm text-gray-600">
            Connect your wallet by clicking the button in the top right corner.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-500"
          aria-label="Close notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
