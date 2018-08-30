#!/bin/bash
for pid in $(pidof tcpdump); do
    if [ $pid != $$ ]; then
        echo "[$(date)] : tcpdump.sh : An experiment is taking place: $pid"
        exit 1;
    fi
done
echo "running conversion"
./pcap2txt.sh
echo "running tcp-parse"
./parse-tcp-stream.sh
echo "running whois"
./parse-details.sh