#!/bin/bash
tcpdump -i $1 dst port 80 or dst port 443 -n -G $2 -W 1 -w ../../data/tcp/trace-%m-%d.pcap