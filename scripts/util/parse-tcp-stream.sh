#!/bin/bash
for file in ../../data/converted/*.txt
do
	node ../parse-tcp-stream.js "$file" 1.1.1.1 > "$file".json
	mv "$file".json ../../data/json
	mv "$file" ../../data/in-progress
done