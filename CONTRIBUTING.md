# Contributing

[![Join the Trash Discord](https://discordapp.com/api/guilds/796594544980000808/widget.png?style=banner2)][trash-discord]

Thank you for considering contributing to TypeHero. As an open sourced project
we only exist by contributions from users like you.

To contribute you will first need to fork the repo. To get the repository up and
running, please look at [LOCAL.md](/LOCAL.MD) for setup instructions.

## Code of Conduct

This project and everyone participating in it is governed by the
[CONTRIBUTING.md Code of Conduct](blob/master/CODE_OF_CONDUCT.md). By
participating you are expected to uphold this code. Please report unacceptable
behavior to <placeholder@typehero.dev>

## I Want to Contribute

> ### Legal Notice
>
> When contributing to this project, you must agree that you have authored 100%
> of the content, that you have the necessary rights to the content and that the
> content you contribute may be provided under the project's license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more
information. Therefore, we ask you to investigate carefully, collect
information, and describe the issue in detail _in your report_. Following the
bug issue template should prompt you for any information we may need, but feel
free to include any information you feel is relevant to the bug.

#### How do I Submit a Good Bug Report?

> ### You must never report security related issues, vulnerabilities, or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead, sensitive bugs must be sent by email to [bugs.sensitive@typehero.dev](mailto:bugs.sensitive@typehero.dev)

We use GitHub issues to track bugs and errors. If you run into an issue with the
project:

- Open an [Issue](/issues/new).
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the _reproduction
  steps_ that someone else can follow to recreate the issue on their own. This
  usually includes your code. For good bug reports you should isolate the
  problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it is filed:

- The project team will label that issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If
  there are no reproduction steps or no obvious way to reproduce the issue, the
  team will ask you for those steps and mark the issue as `needs-repro`. Bugs
  with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked as `needs-fix`,
  as well as possibly other tags (such as `critical`), and the issue will be
  left to be [implemented by someone](#your-first-code-contribution)

### Suggestiong Enhancements

This section guides you through submitting an enhancement suggestion for
CONTRIBUTING.md **including completely new features and minor improvements to
existing functionality**. Following these guidelines will help maintainers and
the community to understand your suggestion and find related suggestions.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Perform a search in [GitHub](/issues), or the
  [Suggestions Channel](https://discord.com/channels/796594544980000808/1143947327892103188)
  on Discord to see if the enhancement has already been suggested. If it has,
  add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's
  up to you to make a strong case to convince the project's developers of the
  merits of this feature. Keep in mind that we want features that will be useful
  to the majority of our users and not just a small subset.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](/issues).

- Use a **clear and descriptive title** for the issue to identify the
  suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as much
  detail as possible.
- **Describe the current behavior** and **explain which behavior you expected to
  see instead** and why. At this point, you can also tell which alternatives do
  not work for you.
- You may want to include **screenshots** which help you demonstrate the steps
  or point out the part which the suggestion is related to.
- Explain why this enhancement would be useful to most CONTRIBUTING.md users.
  You may also want to point out the other projects which have solved a similar
  issues.

### Your First Code Contribution

1. Choose an issue from the [GitHub issues](/issues), ask a member of the team
   to assign the issue to you.
2. Fork the repository
3. Create a branch on your fork. You should either add in the GitHub issue
   number to the branch name, e.g. `382_adds-in-new-thing` or ensure that the
   issue is referenced in the Pull Request or commit message.
4. We do not enforce a commit style like
   [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), but
   you are welcome to use one so long as the summary line accurately describes
   the overall purpose of the work and the ticket is referenced either in the PR
   or the body of the commit message. See [Commits](#commits) for example
   commits.
5. When ready, put up a PR that links from your fork.

## References

### Commits

| ✅ Good                                                               | ❌ Bad           |
| :-------------------------------------------------------------------- | :--------------- |
| Adds in [Cool New Feature Name]                                       | YOOOOOO          |
| fix: Stops a bug on challenge pages causing tests to fail incorrectly | fixing the thing |
| Updates caching strategy to revalidate based on hash key              | Trust me bro     |

[trash-discord]: https://discord.gg/trashdev
