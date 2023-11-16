'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const SearchContext = createContext({});

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
  });

  // useEffect(() => {
  //   // Prepend "Components" to Tailwind UI results that are shown in the "recent" view
  //   if (!isOpen) {
  //     try {
  //       const data = JSON.parse(window.localStorage.getItem(key));
  //       window.localStorage.setItem(key, JSON.stringify(data));
  //     } catch {}
  //   }
  // }, [isOpen]);

  return (
    <>
      {isOpen
        ? createPortal(
            <SearchContext.Provider
              value={{
                isOpen,
                onOpen,
                onClose,
                // onInput,
              }}
            >
              <div>
                <div>asdasdasd</div>
              </div>
            </SearchContext.Provider>,
            document.body,
          )
        : null}
    </>
  );
}

function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      function open() {
        // We check that no other DocSearch modal is showing before opening
        // another one.
        if (!document.body.classList.contains('DocSearch--active')) {
          onOpen();
        }
      }

      if (
        (event.keyCode === 27 && isOpen) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains('DocSearch--active')) {
          open();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose]);
}
