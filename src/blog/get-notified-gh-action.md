---
title: Get notified when a GitHub action completes
date: "2026-02-12"
---

Often I’m waiting to merge a PR until all of its checks have passed. While I do
my best to keep checks as fast as possible they still take long enough that I’m
not going to wait for them to finish. I start something new while I wait.
Frequently I then forget to merge the PR because I’m
completely caught up in the next thing. This is even worse for PRs where
I’m testing changes to the GitHub actions. I have to wait for feedback but then
forget to check when it’s finally there.

To avoid this, I want to get notified when a GitHub action completes. I know I
can [enable notifications for workflow runs](https://docs.github.com/en/actions/concepts/workflows-and-actions/notifications-for-workflow-runs).
GitHub gives me two options; email and/or web. I manage all my GitHub
notifications through the web UI, so email is out of the question. Enabling workflow
notifications for web just means workflow runs will end up in the GitHub UI. I still have to remember to check which brings me back to the
original problem.

Luckily the command line and GitHub's [command line
interface](https://cli.github.com/) can help. Now, whenever I need to be notified
of a workflow run I use:

```sh
gh run watch ; terminal-notifier title "CI" -message "Run completed"
```

`gh run watch` prompts for what run to watch and `;` will run
`terminal-notifier` after `gh` finishes regardless of whether it succeeds or
not.

You can also use `&&` if you only want to be notified on success or `||` for
failures.
