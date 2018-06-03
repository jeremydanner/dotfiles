#!/bin/bash

# Set computer name
sudo scutil --set ComputerName "Batman"
sudo scutil --set HostName "Batman"
sudo scutil --set LocalHostName "Batman"

# Install homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update

# Install the latest version of Bash.
brew install bash
sudo bash -c 'echo /usr/local/bin/bash >> /etc/shells'
chsh -s /usr/local/bin/bash

# install git, node and yarn
brew install git
brew install node
brew install yarn
brew install ssh-copy-id

brew install homebrew/php/php72
sed -i".bak" "s/^\;phar.readonly.*$/phar.readonly = Off/g" /usr/local/etc/php/7.2/php.ini
sed -i "s/memory_limit = .*/memory_limit = -1/" /usr/local/etc/php/7.2/php.ini

brew install homebrew/php/composer
brew install homebrew/php/php-cs-fixer
composer global install

# https://github.com/FriendsOfPHP/PHP-CS-Fixer#globally-composer
brew install homebrew/php/php-cs-fixer

# Disable the Boot Sound on Startup (Mac)
sudo nvram SystemAudioVolume=%80

# Install macOS applications with Brew Cask.
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
brew cask install 'mysqlworkbench'
brew cask install 'android-studio'
brew cask install 'microsoft-teams'
brew cask install 'postman'

# Save screenshots to the downloads directory
defaults write com.apple.screencapture location -string "${HOME}/Downloads"

# Turn of Siri and hide it in the menu bar
defaults write com.apple.siri StatusMenuVisible -bool false
defaults write com.apple.siri UserHasDeclinedEnable -bool true

# Add login screen message.
sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "Found this computer? Please contact Jeremy Danner at jeremydanner2@gmail.com"

# Menu bar: Always show percentage next to the Battery icon
defaults write com.apple.menuextra.battery ShowPercent YES

# Set the icon size of Dock items to 60 pixels
defaults write com.apple.dock tilesize -int 60

# Set a blazingly fast keyboard repeat rate
defaults write NSGlobalDomain KeyRepeat -int 1
defaults write NSGlobalDomain InitialKeyRepeat -int 10

# Add the powerline fonts to make are terminal nice
git clone https://github.com/powerline/fonts.git
cd fonts
./install.sh
cd ..
rm -rf fonts

# Add ZSH for Hyper
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# Move your files
mkdir ~/Code
cd Code
git clone https://github.com/jeremydanner/dotfiles.git
cd dotfiles
cp .bash_profile ~/
cp .bashrc ~/
cp .hyper.js ~/
cp .zshrc ~/


# Laravel valet https://laravel.com/docs/5.4/valet
composer global require laravel/valet
valet install

log 'Finished! Please reboot! Install additional software with `brew install` and `brew cask install`.'
