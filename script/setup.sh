#!/bin/bash

# Set computer name
echo Set computer name?
read computerName
sudo scutil --set ComputerName $computerName
sudo scutil --set HostName $computerName
sudo scutil --set LocalHostName $computerName
echo Your computer name is $computerName

# To allow apps downloaded from Anywhere (Hardcore mode)
sudo spctl --master-disable

# Install homebrew
echo Installing homebrew...
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update

# Install the latest version of Bash.
echo Installing the latest version of Bash...
brew install bash
sudo bash -c 'echo /usr/local/bin/bash >> /etc/shells'
chsh -s /usr/local/bin/bash

# install git, node and yarn
echo install git, node & yarn
brew install git
brew install node
brew install yarn
brew install ssh-copy-id

# Disable the Boot Sound on Startup (Mac)
sudo nvram SystemAudioVolume=%80

# Install macOS applications with Brew Cask.
echo Install macOS applications with Brew Cask
brew cask install 'hyper'
brew cask install '1password'
brew cask install 'appcleaner'
brew cask install 'atom'
brew cask install 'phpstorm'
brew cask install 'google-chrome'
brew cask install 'sequel-pro'
brew cask install 'slack'
brew cask install 'spotify'
brew cask install 'caprine'
brew cask install 'firefox'
brew cask install 'microsoft-teams'
brew cask install 'postman'
brew cask install 'notable'
brew cask install 'poedit'
brew cask install 'docker'

echo Setting up system defaults
# Save screenshots to the downloads directory
defaults write com.apple.screencapture location -string "${HOME}/Downloads"

# Turn of Siri and hide it in the menu bar
defaults write com.apple.siri StatusMenuVisible -bool false
defaults write com.apple.siri UserHasDeclinedEnable -bool true

# Add login screen message.
sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "Found this computer? Please contact Elicit AB at jeremy.danner@elicit.se or jeremydanner2@gmail.com"

# Menu bar: Always show percentage next to the Battery icon
defaults write com.apple.menuextra.battery ShowPercent YES

# Set the icon size of Dock items to 30 pixels
defaults write com.apple.dock tilesize -int 30

# Set a blazingly fast keyboard repeat rate
defaults write NSGlobalDomain KeyRepeat -int 1
defaults write NSGlobalDomain InitialKeyRepeat -int 10

# Add the powerline fonts to make are terminal nice
echo Adding the powerline fonts
git clone https://github.com/powerline/fonts.git
cd fonts
./install.sh
cd ..
rm -rf fonts

# Add ZSH for Hyper
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# Move your files
echo moving bash files to the root
cp ~/Code/dotfiles/.bash_profile ~/
cp ~/Code/dotfiles/.bashrc ~/
cp ~/Code/dotfiles/.hyper.js ~/
cp ~/Code/dotfiles/.zshrc ~/

echo 'Finished! Please reboot! Install additional software with `brew install` and `brew cask install`.'
