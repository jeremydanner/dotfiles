#!/bin/bash

echo Looking for Homebrew updates
brew update

echo Updating Taps
brew upgrade

echo Updating Casks
brew cask upgrade

brew doctor
echo Computer up to date
