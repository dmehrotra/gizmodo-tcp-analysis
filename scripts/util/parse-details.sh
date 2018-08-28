#!/bin/bash
for file in ../../data/tcp/*.json
do
	node ../parse-details.js "$file"
done