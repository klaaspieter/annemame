---
layout: post
title: Automatic terminal dark mode
date: "2021-04-06 16:20:00"
---

I am not #teamdarkmode or #teamlightmode. I like dark mode when it's dark but otherwise prefer light mode. macOS switches automatically but unfortunately that cannot be said for terminal applications.

I already had it set up so I could switch relatively quick but, inspired by [this post][fatih's post] by Fatih Arslan, I decided to automate my setup as well. I initially set out to copy the setup in that post exactly but ended up using it merely as an inspiration because I use kitty instead of alacritty.

To better understand the [commit in my dotfiles][dotfiles commit] it's useful to know what I already had:

- [gruvbox] as my color scheme
- vim, [set up][vim setup] to read the `$THEME` environment variable and calling `set background` based on the value when vim first started. I used [vim-unimpaired's yob] shortcut to quick switch if vim was already running.
- tmux, [set up][tmux setup] to read `~/.$THEME.tmux.conf`. Where `~/.tmux.dark.conf` and `~/.tmux.light.conf` correspond to gruvbox's dark and light variants respectively.
- kitty, [set up][kitty setup] to read `~/.config/kitty/theme.conf` which is a symlink to either `dark.conf` or `light.conf` which contain gruvbox's dark and light variants for kitty.

This was tied together by the [`theme`] function. Which I stole from [Teo Ljungberg][teo theme function]. My solution ended up being similar to Fatih's but differing on some key points:

### <s>Vim</s> NeoVim

Fatih went through [several iterations][fatih vim] trying to figure out how to tell vim to change background color. He ended writing a fish script to find all vim instances inside tmux and tells _tmux_ to write `:call ChangeBackground` in each instance.

I wasn't comfortable with this for two reasons:

1. I don't use fish. I briefly looked into using it but decided against using a non-POSIX compliant shell.
2. It seemed too hacky.

Instead I looked for a way to talk to vim directly. As far as I know there is no way with normal vim, but NeoVim is built on top of an [RPC API]. I told NeoVim to listen on `/tmp/nvim` by [setting `NVIM_LISTEN_ADDRESS`][nvim listen address config]. This makes it possible to call `set background` over RPC. I tried for way too long to talk to NeoVim directly from neovim using `--embed` but wasn't able to get it to work. I ended up using `pynvim` and placing the logic in a [`neovim-background` script][neovim-background].

### Tmux

For tmux I ended up using [Fatih's solution][fatih tmux]. He uses tmuxline to automatically change tmux's colors based on the current vim colors.

Read [Fatih's post][fatih tmux] for more details.

### Kitty

Kitty has excellent support for being [controlled with scripts][kitty remote control]. I was already using `set-colors` in my previous solution so I didn't need to change anything here. For completeness: you need a [`macos-launch-services-cmdline`] file with:

```sh
--listen-on unix:/tmp/kitty
```

and calling:

```
kitty @ --to unix:/tmp/kitty set-colors\
  --all --configured "$HOME/.config/kitty/theme.conf"
```

As mentioned in the intro `theme.conf` is a symlink to `dark.conf` or `light.conf` which contain gruvbox's dark and light variants for kitty.

### Tying it together

Now that we know how to change the colors of each terminal application we need to tie them together. I moved my [`theme`] function to a shell script and tied it all together.

To automatically change appearance when macOS changes we need something to notify us. [`dark-mode-notify`] is a script that listens for the `AppleInterfaceThemeChangedNotification` global notification. When the notification is fired it runs `theme` with either a `dark` or `light` argument.

Finally we need a way to always have `dark-mode-notify` running. For this we use a [launchctl service]. I started this once using `launchctl start ~/Library/LaunchAgents/me.anneme.dark-mode-notify.plist` and now macOS takes care of keeping it running. The launch service is the real reason I made `theme` a script instead of a zsh function. I couldn't figure out how to call the function from another script. Nor did I really want to figure it out.

In summary the entire process:

1. launchctl runs a [`dark-mode-notify` service][launchctl service]
2. the service [runs `dark-mode-notify`][launchctl dark-mode-notify], providing [our `theme` script][launchctl theme] as the argument.
3. `theme` symlinks `kitty.light.conf` or `kitty.dark.conf` to `kitty.theme.conf`
4. `theme` changes the tmux theme
5. `theme` changes the vim theme using [`neovim-background`][neovim-background] which in turn uses NeoVim's RPC API to `set background` of all vim instances.
6. `theme` sets the kitty theme to the previously symlinked `kitty.theme.conf` using [kitty remote control]

### DarkModeBuddy

I'm not entirely happy with macOS auto settings. Instead I use an app called [DarkModeBuddy] which switches between light and dark modes based on the ambient light level.

I'm currently using the following settings:

![DarkModeBuddy settings window](/assets/2021-04-06-automatic-terminal-dark-mode-darkmodebuddy.png)

[fatih's post]: https://arslan.io/2021/02/15/automatic-dark-mode-for-terminal-applications/
[dotfiles commit]: https://github.com/klaaspieter/dotfiles/commit/af37f3a706dc5ca86544ff5a9f043fd902108a97
[gruvbox]: https://github.com/morhetz/gruvbox
[vim setup]: https://github.com/klaaspieter/dotfiles/blob/820e222ac34e6748ca22d0b076a139966978211c/vimrc#L122-L134
[vim-unimpaired's yob]: https://github.com/tpope/vim-unimpaired/blob/4afbe5ebf32ad85341b4c02b0e1d8ca96a64c561/plugin/unimpaired.vim#L265
[tmux setup]: https://github.com/klaaspieter/dotfiles/blob/e53411ae0caeabf5074905fd49acf34b949888fe/tmux.conf#L63
[kitty setup]: https://github.com/klaaspieter/dotfiles/blob/e53411ae0caeabf5074905fd49acf34b949888fe/config/kitty/kitty.conf#L6
[`theme`]: https://github.com/klaaspieter/dotfiles/blob/e53411ae0caeabf5074905fd49acf34b949888fe/zshrc#L155-L202
[teo theme function]: https://github.com/teoljungberg/dotfiles/blob/c25e81a127c8f466189813c64e96a4e2a30c9c0d/zshrc#L160-L210
[fatih vim]: https://arslan.io/2021/02/15/automatic-dark-mode-for-terminal-applications/#vim
[rpc api]: https://neovim.io/doc/user/api.html
[nvim listen address config]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/zshrc#L92
[neovim-background]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/bin/neovim-background
[fatih tmux]: https://arslan.io/2021/02/15/automatic-dark-mode-for-terminal-applications/#tmux
[kitty remote control]: https://sw.kovidgoyal.net/kitty/remote-control.html#controlling-kitty-from-scripts-or-the-shell
[`macos-launch-services-cmdline`]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/config/kitty/macos-launch-services-cmdline
[`dark-mode-notify`]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/bin/dark-mode-notify
[`theme`]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/bin/theme
[launchctl service]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/Library/LaunchAgents/me.annema.dark-mode-notify.plist
[launchctl dark-mode-notify]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/Library/LaunchAgents/me.annema.dark-mode-notify.plist#L16
[launchctl theme]: https://github.com/klaaspieter/dotfiles/blob/af37f3a706dc5ca86544ff5a9f043fd902108a97/Library/LaunchAgents/me.annema.dark-mode-notify.plist#L17
[darkmodebuddy]: https://github.com/insidegui/DarkModeBuddy
