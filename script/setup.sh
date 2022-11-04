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

# install git, node and yarn
echo install git, node & yarn
brew install git
brew install node
brew install yarn

# Move files and folders to the trash https://www.npmjs.com/package/trash-cli
npm install --global trash-cli

# Disable the Boot Sound on Startup (Mac)
sudo nvram SystemAudioVolume=%80

# Install macOS applications with Brew Cask.
echo Install macOS applications with Brew Cask
brew install --cask 'hyper'
brew install --cask '1password'
brew install --cask 'appcleaner'
brew install --cask 'visual-studio-code'
brew install --cask 'phpstorm'
brew install --cask 'google-chrome'
brew install --cask 'sequel-pro'
brew install --cask 'spotify'
brew install --cask 'firefox'
brew install --cask 'microsoft-teams'
brew install --cask 'postman'
brew install --cask 'poedit'
brew install --cask 'docker'
brew install --cask 'discord'

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



# Add oh-my-zsh for Hyper
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

echo 'Finished! Please reboot! Install additional software with `brew install` and `brew cask install`.'
