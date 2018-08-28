#!/bin/bash
for file in ../../data/tcp/*.pcap
do
  tcpdump -ttttnnr "$file" > "$file".txt
done