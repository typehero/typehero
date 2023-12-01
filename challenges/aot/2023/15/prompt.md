## Box The Toys!

_\[Santa walks by as Bernard, the head elf, is yelling at the other elves..\]_

> _\[Bernard (to his staff)\]_ LET'S GO ELVES! LET'S GO! KEEP BOXING TOYS!
>
> _\[Santa\]_ Bernard.. Seems like it's not going well.
>
> _\[Bernard\]_ Was anyone asking you!?
>
> _\[Santa\]_ Did you deploy the new toy boxing API yesterday?
>
> _\[Bernard\]_ No, we didn't get to it. Julius called out sick.
>
> _\[Santa\]_ Taking too many sick days shows a lack of commitment. We should get rid of Julius.
>
> _\[Bernard (rolling eyes)\]_ And then not replace him? Yeah. No Thanks.
>
> _\[Santa\]_ Well it was on the sprint and today's the last day of the sprint.
>
> _\[Bernard\]_ We don't deploy on Fridays.
>
> _\[Santa\]_ Aren't we doing continuous deployment now? You had this whole big thing at the last shareholder meeting about it?
>
> _\[Bernard\]_ No. For the 100th time. We're doing continuous _delivery_, which is completely different and gives us control over when we deploy.
>
> _\[Santa\]_ Well I need that `BoxToys` type. If you can't handle this project, Bernard, there are plenty of other elves who can. I need your full commitment.
>
> _\[Bernard\]_ Ok. Fine. I'll do it myself.
>
> _\[Santa\]_ That's what I like to see!

## The `BoxToys` API

The `BoxToys` type takes two arguments:

1. the name of a toy
2. the number of of boxes we need for this toy

And the type will return a tuple containing that toy that number of times.

But there's one little thing.. We need to support the number of boxes being a union. That means our resulting tuple can also be a union. Check out `test_nutcracker` in the tests to see how that works.
