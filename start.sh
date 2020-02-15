# /bin/sh
until npm start; do
    echo "Bot stopped with exit code $?. Restarting..." >&2
    sleep 1
done