// TEST CASE START (code in test cases are not editable)
type cases = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>
]


// @ts-expect-error
MyPick<Todo, 'title' | 'completed' | 'invalid'>

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}

// CODE START (code below this line is editable)
type MyPick<T, K> = any;
