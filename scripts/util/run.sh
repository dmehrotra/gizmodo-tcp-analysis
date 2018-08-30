#!/bin/bash
for pid in $(pidof tcpdump); do
    if [ $pid != $$ ]; then
        echo "[$(date)] : tcpdump.sh : An experiment is taking place: $pid"
    	./parse-tcp-stream.sh
    	./parse-details.sh
    else
    	./pcap2txt.sh
    	./parse-tcp-stream.sh
    	./parse-details.sh
    fi

done