from collections import Counter
import sys
import os
from datetime import datetime, timedelta
from dateutil.parser import parse

def process(line,company):
    l=line.split(" doof")
    dst = l[1].split("DST=")[1].split(" ")[0]
    date = l[0]
    return [dst,date,company]


def build_report(amazon,facebook,google,apple,microsoft,other,dates):
    # for a in microsoft:
    #     print(a)


    print("*************************")
    print("========================")

    print("---------------")
    print ("facebook")
    print(len(facebook))

    print("---------------")
    print ("amazon")
    print(len(amazon))

    
    print("---------------")
    print ("google")
    print(len(google))

    
    print("---------------")
    print ("apple")
    print(len(apple))
    
    print("---------------")
    print ("microsoft")
    print(len(microsoft))
    
    print("---------------")
    print ("other")
    print(len(other))


def run(file):
    dates=[]
    other=[]
    facebook=[]
    amazon=[]
    google=[]
    apple=[]
    microsoft=[]
    with open(file) as fp:
        for line in fp:
            date = line.split(" doof")[0]
            dates.append(date)
            if "Amazon" in line:
                print line
                amazon.append(process(line,"aws"))
            if "FACEBOOK" in line:
                facebook.append(process(line,"fb"))
            if "GOOGLE" in line:
                google.append(process(line,"google"))
            if "APPLE" in line:
                apple.append(process(line,"apple"))
            if "MICROSOFT" in line:
                microsoft.append(process(line,"microsoft"))
            if "packet:" in line:
                other.append(process(line,"other"))

        build_report(amazon,facebook,google,apple,microsoft,other,dates)



if len(sys.argv) == 2:
    file = sys.argv[1]
    run(file)
else:
    for file in os.listdir("data"):
        
        run("data/"+file)
        print("\n")
        print("\n")






















