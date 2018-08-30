#!/bin/bash

for pid in $(pidof tcpdump); do
    if [ $pid != $$ ]; then
        echo "[$(date)] : tcpdump.sh : Process is already running with PID $pid"
        kill $pid
        exit 1
    fi
done