#!/bin/bash
for file in ../../data/tcp/*.pcap
do 
  tcpdump -ttttnnr "$file" > "$file".txt
  mv "$file".txt ../../data/converted
  mv "$file" ../../data/in-progress
done