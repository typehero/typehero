// TEST CASE START
Extends<HelloWorld, `Hello, ${string}`>()

Extends<HelloWorld, `${string}!`>()

// CODE START
type HelloWorld = ""
