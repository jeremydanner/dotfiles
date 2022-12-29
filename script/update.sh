#!/bin/bash

echo Looking for Homebrew updates
brew update

# 'brew unpin <formula>' To allow that formulae to update again
# pin cask to ignor updates.
echo Skipping upgrad of node
node -v
brew pin node@18 # node LTS

echo Updating Taps
brew upgrade

echo Updating Casks
brew upgrade --cask

echo Cleaning
brew cleanup

brew doctor
echo Computer up to date
