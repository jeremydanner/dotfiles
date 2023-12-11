# .dotfiles
### A script to bootstrap a minimal macOS development system.
```BASH
mkdir ~/Code
cd ~/Code
git clone https://github.com/jeremydanner/dotfiles.git
cd dotfiles
./script/setup.sh
```

### Keep your computer up to date by running 

```BASH
~/Code/dotfiles/script/update.sh
```
Add an alias to your `~/.zshrc` file 

``` 
# alias for updating home brew taps and casks
alias update='~/Code/dotfiles/script/update.sh'
```
