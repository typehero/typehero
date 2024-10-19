## Filtering The Children (part 3)

Yet again, Santa has made a request to change the children filtering code. This time he just sent an email to the entire engineering team (which is absolutely _not_ the process, but since Santa is sometimes a bit difficult to communicate with, no one has yet had the courage to tell him). Here's the contents of the email.

```http
POST /sendmail HTTP/1.1
Host: mail.hohoholdings.com
Content-Type: text/plain; charset=utf-8
Content-Length: 420

From: kris.kringle@hohoholdings.com
To: engineering@hohoholdings.com
Subject: Code Changes Needed

Hello beloved team!

Looks like we need some changes to the code again!

1. there are sometimes naughty kids in the same list
1. turns out I don't actually need to see the nice children in the list, after all
1. my golf game ran late this morning.. so since the other two changes were quick to implement, I'm sure this will be just as fast, right?!

- Kris Kringle
  "at Santa's workshop, we value loyalty over all else"
```

Wow. What a pointless email. For once, calling a meeting would have been better.

Good thing we got some experience reading the tests because this email may as well have said "do work. thanks." (lol).

Off to the tests to see how this is actually supposed to work!
