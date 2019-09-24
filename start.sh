# /bin/sh
until node mcbot.js; do
    echo "Bot stopped with exit code $?. Restarting..." >&2
    sleep 1
done