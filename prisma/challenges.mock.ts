import type { Difficulty, Prisma } from '@prisma/client';
import { gId, trashId } from './seed';
function randomTrueOrFalse() {
  return Math.random() > 0.5;
}
export const CHALLENGE_MAP: Record<
  Difficulty,
  (v: number) => Prisma.ChallengeCreateWithoutUserInput
> = {
  BEGINNER: (challengeIndex: number) => ({
    name: `Beginner Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    Bookmark: randomTrueOrFalse()
      ? {
          create: {
            userId: randomTrueOrFalse() ? trashId : gId,
          },
        }
      : undefined,
    description: `Implement the built-in \`Pick<T, K>\` generic without using it.

Constructs a type by picking the set of properties \`K\` from \`T\`

For example:

\`\`\`ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
\`\`\`
    `,
    prompt: `/* _____________ Test Cases _____________ */
Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

/* _____________ Your Code Here _____________ */
type HelloWorld =`,
    difficulty: 'BEGINNER',
  }),

  EASY: (challengeIndex: number) => ({
    name: `Easy Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: `Implement the built-in \`Pick<T, K>\` generic without using it.

Constructs a type by picking the set of properties \`K\` from \`T\`

For example:

\`\`\`ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
\`\`\`
    `,
    prompt: `/* _____________ Test Cases _____________ */
Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

/* _____________ Your Code Here _____________ */
type HelloWorld =`,
    difficulty: 'EASY',
  }),
  MEDIUM: (challengeIndex: number) => ({
    name: `Medium Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: `
    Implement the built-in \`Omit<T, K>\` generic without using it.

Constructs a type by picking the set of properties \`K\` from \`T\`

For example:

\`\`\`ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
\`\`\`
    `,
    prompt: `/* _____________ Test Cases _____________ */
Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

/* _____________ Your Code Here _____________ */
type HelloWorld =`,
    difficulty: 'MEDIUM',
  }),
  HARD: (challengeIndex: number) => ({
    name: `Hard Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: `
    Implement a simpiled version of a Vue-like typing support.

By providing a function name \`SimpleVue\` (similar to \`Vue.extend\` or \`defineComponent\`), it should properly infer the \`this\` type inside computed and methods.

In this challenge, we assume that SimpleVue take an Object with \`data\`, \`computed\` and \`methods\` fields as it's only argument,

- \`data\` is a simple function that returns an object that exposes the context \`this\`, but you won't be accessible to other computed values or methods.

- \`computed\` is an Object of functions that take the context as \`this\`, doing some calculation and returns the result. The computed results should be exposed to the context as the plain return values instead of functions.

- \`methods\` is an Object of functions that take the context as \`this\` as well. Methods can access the fields exposed by \`data\`, \`computed\` as well as other \`methods\`. The different between \`computed\` is that \`methods\` exposed as functions as-is.

The type of \`SimpleVue's return value can be arbitrary\.

\`\`\`ts
const instance = SimpleVue({
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
})
\`\`\`
`,
    prompt: `/* _____________ Test Cases _____________ */
Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

/* _____________ Your Code Here _____________ */
type HelloWorld =`,
    difficulty: 'HARD',
  }),
  EXTREME: (challengeIndex: number) => ({
    name: `Extreme Challenge ${challengeIndex + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: `
Implement a generic \`GetReadonlyKeys<T>\` that returns a union of the readonly keys of an Object.

For example

\`\`\`ts
interface Todo {
  readonly title: string
  readonly description: string
  completed: boolean
}

type Keys = GetReadonlyKeys<Todo> // expected to be "title" | "description"
\`\`\`
`,
    prompt: `/* _____________ Test Cases _____________ */
Extends<HelloWorld, \`Hello, \${string}\`>()

Extends<HelloWorld, \`\${string}!\`>()

/* _____________ Your Code Here _____________ */
type HelloWorld =`,
    difficulty: 'EXTREME',
  }),
};
