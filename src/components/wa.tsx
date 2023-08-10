'use client';

import { useState } from "react";
import { Input } from "./ui/input";

const all = [
  'infer',
  'built-in',
  'union',
  'utils',
  'object-keys',
  'this',
  'vue',
  'readonly',
  'deep',
  'tuple',
  'array',
  'promise',
  'arguments',
  'string',
  'object',
  'recursion',
  'split',
  'json',
] as const;

export default function ChallengeTagPicker() {
  const [value, setValue] = useState('');

  return (
    <div className="relative">
      <header>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </header>
      <section className="absolute bottom-0 translate-y-full bg-blue-300/30 left-0 right-0">
        hi
      </section>
    </div>
  );
}