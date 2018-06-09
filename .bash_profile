export PATH="~/.composer/vendor/bin:/usr/local/sbin:$PATH"
eval $(/usr/libexec/path_helper -s)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Switch to ZSH shell
if test -t 1; then
exec zsh
fi
