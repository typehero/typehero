## Protect the List

_\[a conversation overhead two elves, Wunorse and Alabaster, at Santa's workshop on a monday morning after all the elves were forced to work all weekend\]_

> _\[Wurnose\]_ The world will not know peace until every consultant involved in pushing SOC2 is dead and in the ground.
>
> _\[Alabaster\]_ Rough weekend?
>
> _\[Wurnose\]_ Yes. And now I've just gotten word from the higher-ups that I have to make our entire codebase's types readonly. DEEP readonly.
>
> _\[Alabaster\]_ Ouch. But at least it'll be better because _something something functional programming superiority something something_..
>
> _\[Wurnose\]_ That's not the point. The point is that there _IS NO POINT_. They're saying this is a requirement of SOC2. This doesn't have the slightest thing to do with SOC2. It's literally security theater at this point. And we're the puppets.
>
> _\[Alabaster\]_ Let's try to use this as an excuse to port the codebase to Rust where everything's immutable by default.
>
> _\[Wurnose\]_ I already tried that. They said Rust is too new and untested. They're considering Go, though.
>
> _\[Alabaster\]_ Lol dafuq? Rust is older than Go by like 3 years. Ok. Sorry I asked. Let's implement DeepReadonly then!

## The API

`SantaListProtector` takes in an arbitrary type as an input and modifies that type to be readonly. The trick here is that it must also work for any nested objects.
