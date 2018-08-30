#!/bin/bash
for pid in $(pidof tcpdump); do
    if [ $pid != $$ ]; then
        echo "[$(date)] : tcpdump.sh : Process is already running with PID $pid"
        kill $pid
    fi
done

if [ -z "$3" ];
  then
    nohup tcpdump -U -i $1 dst port 80 or dst port 443 -n -G $2 -W 1 -w ./data/tcp/trace-%m-%d.pcap > /dev/null 2>&1 &
else
	nohup tcpdump -U -i $1 dst port 80 or dst port 443 -n -G $2 -W 1 -w ./data/tcp/trace-"$3".pcap > /dev/null 2>&1 &
fi
