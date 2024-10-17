## Filtering The Children (part 2)

_\[transcript of a slack conversation at 11:23pm between Santa and Chipper (one of the elves that worked on the filtering code from yesterday)\]_

> _\[Santa\]_ We've got a big problem. That code that you gave me yesterday doesn't work!
>
> _\[Chipper\]_ what doesn't work about it?
>
> _\[Santa\]_ It turns out I need the data formatted in a completely different way! The inputs and outputs all need to be different.
>
> _\[Chipper\]_ ok, so it sounds like the requirements have changed. did you ask my manager? it's late and I'm relaxing. I'm in the middle of a game of League of Legends.
>
> _\[Santa\]_ Is that like RuneScape? Well anyway, would you mind helping me out in a pinch? Think of this as paying your dues for a better position later!
>
> _\[Chipper\]_ ok. I guess.
>
> _\[Santa\]_ Wonderful! Here are the inputs and outputs! That oughta be plenty for you! Ok, I gotta get some rest for a golf game I'm having tomorrow. Signing off!

## Developing From The Tests

As you can see, sometimes leadership like Santa manage to convince themselves they have fantastic product vision, you'll get little more than basic inputs and outputs, and you'll have to figure out the behavior from there. Don't be flustered. Take a look at the tests and try to figure out what the behavior is supposed to be.

Start by identifying the inputs for our `AppendGood` type. Ask yourself if there should be any generic type constraints on the inputs (there may not need to be, or at least right away).

Then try to set up a scaffold that will at least return the same values for each property. Your next step is to transform the properties somehow..
