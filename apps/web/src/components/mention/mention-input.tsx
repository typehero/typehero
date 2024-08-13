'use client';

import { Textarea } from '@repo/ui/components/textarea';
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useDebouncedValue } from '~/utils/useDebouncedValue';
import { UserResults } from './user-results';

const NO_OP_KEYS = ['ArrowDown', 'ArrowUp', 'Tab', 'Enter'];

export function MentionInput() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  // const [selectedUser, setSelectUser] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const deferredQuery = useDebouncedValue(query);

  const onSelectedUser = (user: string) => {
    insert(user);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value;
    setText(text);
  };

  const insert = (username: string) => {
    if (!textAreaRef.current || !query) {
      return;
    }

    const text = textAreaRef.current.value;
    const queryToFind = `@${query}`;
    const startIndex = text.indexOf(queryToFind);
    const endIndex = startIndex + queryToFind.length;

    const wrappedUserName = `[@${username}](/@${username})`;

    const newText = text.slice(0, startIndex) + wrappedUserName + text.slice(endIndex);

    setText(newText);
    setIsQuerying(false);
    setQuery('');
  };

  // this handles the scenario where a user uses arrow keys
  // to navigate back to a mention
  // need to handle case where if hitting arrows while in the same word do not display the
  // popover unless a down arrow is used. can probably just use current query !== deferredQuery + isQuerying var to decide or
  const onKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsQuerying(false);
      return;
    }
    const cursorPosition = e.currentTarget.selectionStart;

    const textBeforeCursor = text.slice(0, cursorPosition);
    const textAfterCursor = text.slice(cursorPosition);

    const lastWordBeforeCursor = textBeforeCursor.split(/\s+/).pop();
    const firstWordAfterCursor = textAfterCursor.split(/\s+/).shift() || '';

    const fullWord = lastWordBeforeCursor + firstWordAfterCursor;

    if (fullWord?.startsWith('@')) {
      const [, query = ''] = fullWord.split('@');
      if (query) {
        setIsQuerying(true);
      } else {
        setIsQuerying(false);
      }
      setQuery(query);
    } else {
      setIsQuerying(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // when the popover is visible we only want the up and down arrow keys
    // to select from the user list
    if (isQuerying && NO_OP_KEYS.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <Textarea
        autoFocus
        className="resize-none border-0 px-3 py-2 focus-visible:ring-0 md:max-h-[calc(100vh_-_232px)]"
        onChange={onChange}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        value={text}
        ref={textAreaRef}
      />
      <UserResults query={deferredQuery} isOpen={isQuerying} onSelectedUser={onSelectedUser} />
    </div>
  );
}
