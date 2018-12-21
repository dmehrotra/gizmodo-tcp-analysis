from collections import Counter
import sys
file = sys.argv[1]
import os
ar=[]
count =0
with open(file) as fp:  
    for line in fp:
        count=count+1

print count

