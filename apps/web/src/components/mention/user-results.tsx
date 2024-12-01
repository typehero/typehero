'use client';

import { cn } from '@repo/ui/cn';
import { Popover, PopoverAnchor, PopoverContent } from '@repo/ui/components/popover';
import { useToast } from '@repo/ui/components/use-toast';
import { UserAvatar } from '@repo/ui/components/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '../loader';
import { searchUsers } from './actions';

interface UserResultsProps {
  isOpen: boolean;
  query: string;
  onFocusOutside: () => void;
  onSelectedUser: (user: string) => void;
}

export function UserResults({ isOpen, onFocusOutside, onSelectedUser, query }: UserResultsProps) {
  const { toast } = useToast();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    retry: false,
    staleTime: 10000,
    queryKey: ['search-users', query],
    queryFn: () => {
      return searchUsers(query);
    },
    enabled: Boolean(query),
  });

  // when we fetch new users or toggle the popover we want to reset the
  // index to 0
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Query limit exceeded!',
        description: 'Usernames are limited to 39 characters.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    const controller = new AbortController();
    const scrollTo = (index: number) => {
      const node = popoverRef.current?.children[0]?.children[index];
      node?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    };

    window.addEventListener(
      'keydown',
      (e) => {
        if (!users) {
          return;
        }

        if (e.key === 'ArrowDown') {
          setSelectedIndex((si) => {
            const index = (si + 1) % users.length;
            scrollTo(index);
            return index;
          });
        }
        if (e.key === 'ArrowUp') {
          setSelectedIndex((si) => {
            const index = si - 1 < 0 ? users.length - 1 : si - 1;
            scrollTo(index);
            return index % users.length;
          });
        }
      },
      { signal: controller.signal },
    );

    window.addEventListener(
      'keyup',
      (e) => {
        if ((e.key === 'Tab' || e.key === 'Enter') && isOpen) {
          const selectedUser = users?.[selectedIndex];
          if (selectedUser) {
            onSelectedUser(selectedUser.name);
          }
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [onSelectedUser, selectedIndex, isOpen, users]);

  return (
    <Popover open={isOpen}>
      <PopoverAnchor className="absolute bottom-0 left-0" />
      <PopoverContent
        ref={popoverRef}
        className="absolute left-0 h-80 w-80 overflow-y-auto border-gray-400 bg-zinc-100 p-0 dark:border-gray-700 dark:bg-zinc-900"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={onFocusOutside}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-lg font-semibold">
            <Loader className="h-8 w-8" />
          </div>
        ) : (
          <>
            {(users?.length ?? 0) > 0 ? (
              <ul>
                {users?.map((user, index) => {
                  return (
                    <li key={user.id}>
                      <button
                        onClick={() => {
                          const selectedUser = users?.[index];
                          if (selectedUser) {
                            onSelectedUser(selectedUser.name);
                          }
                        }}
                        className={cn(
                          selectedIndex === index ? 'bg-zinc-400/50 dark:bg-zinc-600/50' : '',
                          'flex w-full cursor-pointer justify-start gap-3 rounded-none px-4 py-3  hover:bg-zinc-400/50 dark:hover:bg-zinc-600/50',
                        )}
                      >
                        <UserAvatar
                          className="h-10 w-10 border border-gray-500 dark:border-gray-700"
                          src={user.image ?? ''}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-500">
                            @{user.name}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-lg font-semibold">
                Users not found.
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
