#!/bin/bash
for file in ../../data/json/*.json
do
	node ../parse-details.js "$file"
	mv "$file" ../../data/backup
done