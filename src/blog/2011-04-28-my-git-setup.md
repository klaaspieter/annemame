---
title: My git setup
date: '2011-04-28T17:30:00.000+02:00'
---

I have been using git since I started working on Cappuccino. Over time I’ve found several useful additions to my configuration that made working with it easier.

### Bash additions

While working with git it’s easy to get lost in branches, tags and commits. The bash completion script included with git helps to keep track. It's core functionality is autocompletion, but it can optionally show the current branch after your prompt.
Installation instructions are included in the file, which you can find in the git repository under `contrib/completion/`. If you change your bash prompt to show the current branch (step 3) consider using `PS1='\h:\W'$RED'$(__git_ps1 "@%s")'$NONE'\$ '`. It will display the current branch in red, making it much more obvious.

### Aliases

Git (since version 1.4) includes support for aliasing commands. For a quick introduction see [this][Alias tutorial] tutorial on the git wiki.

[Alias tutorial]: https://git.wiki.kernel.org/index.php/Aliases

These are the aliases I currently use:

    [alias]
    	co = checkout
        mg = merge
    	st = status
    	ci = commit
    	br = branch
    	df = difftool
        lg = log --graph --pretty=format:'%C(bold red)%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold green)<%an>%Creset' --abbrev-commit --date=relative
    	lc = log ORIG_HEAD.. --no-merges --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative

With the exception of `lc` and `lg` all my aliases are shortcuts for git commands. The `lg` alias is a shortcut for `git log` with custom formatting. `lc` is the same, but it only shows the last fetched commits. While you’re adding aliases don’t forget to alias git itself as well. I’ve added the following to `~/.bash_login`:

    alias g='git'
    # Make the autocompleton work with the g alias
    complete -o bashdefault -o default -o nospace -F _git g 2>/dev/null \
	|| complete -o default -o nospace -F _git g

### Editor and difftool

I’ve changed my default git editor to Textmate. This means commands that require text entry, such as commit and tag, will open Textmate. You can change the editor by running: `git config --global core.editor 'mate -w'` or by setting the `GIT_EDITOR` environment variable.

Lastly I’ve also changed my difftool to [Kaleidoscope][]. This is easily done from Kaleidscope itself by going to the Integration in the Kaleidscope menu. If you don’t have Kaleidoscope already you can [currently][Approval party] buy it for a 50% discount in the [Mac app store][Kaleidoscope MAS].

[Kaleidoscope]: http://www.kaleidoscopeapp.com
[Approval party]: http://www.approvalparty.com
[Kaleidoscope MAS]: http://itunes.apple.com/us/app/kaleidoscope/id412622418?mt=12&ls=1

### Summary

This is just a summary of how I configured git. If this post has whet your appetite use [Google][] and mix and match several setups to find _your_ perfect git setup.

[Google]:http://www.google.com
