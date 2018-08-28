#!/bin/bash
for file in ../../data/tcp/*.txt
do
	node ../parse-tcp-stream.js "$file" 1.1.1.1 > "$file".json
done