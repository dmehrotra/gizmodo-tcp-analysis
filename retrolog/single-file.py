import sys
import matplotlib.pyplot as plt
import matplotlib.dates as md
from datetime import datetime, timedelta
from dateutil.parser import parse
import time
import os

from operator import itemgetter
from collections import defaultdict

AWScount = 0
FBcount = 0
Gcount = 0
APPLEcount = 0
Ocount = 0
ar=[]
colors = {'red': 'r', 'blue': 'b', 'green': 'g','black': 'b'}


def plot_timeline(dataset, **kwargs):
    """
    Plots a timeline of events from different sources to visualize a relative
    sequence or density of events. Expects data in the form of:
        (timestamp, source, category)
    Though this can be easily modified if needed. Expects sorted input.
    """
    outpath = kwargs.pop('savefig', None)  # Save the figure as an SVG
    colors  = kwargs.pop('colors', {})     # Plot the colors for the series.
    series  = set([])                      # Figure out the unique series

    # Bring the data into memory and sort
    dataset = sorted(list(dataset), key=itemgetter(0))

    # Make a first pass over the data to determine number of series, etc.
    for _, source, category in dataset:
        series.add(source)
        if category not in colors:
            colors[category] = 'k'

    # Sort and index the series
    series  = sorted(list(series))

    # Create the visualization
    x = []  # Scatterplot X values
    y = []  # Scatterplot Y Values
    c = []  # Scatterplot color values

    # Loop over the data a second time
    for timestamp, source, category in dataset:
        timestamp = datetime.fromtimestamp(timestamp)
        datenum=md.date2num(timestamp)
        x.append(timestamp)
        y.append(series.index(source))
        c.append(colors[category])

    plt.figure(figsize=(14,4))
    plt.title(kwargs.get('title', "Timeline Plot"))
    # plt.ylim((-1,len(series)))
    # plt.xlim((-1000, dataset[-1][0]+1000))
    ax=plt.gca()
    xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
    ax.xaxis.set_major_formatter(xfmt)
    plt.yticks(range(len(series)), series)
    plt.subplots_adjust(bottom=0.2)
    plt.xticks( rotation=25 )
    plt.scatter(x, y, color=c, alpha=0.85, s=10)

    if outpath:
        return plt.savefig(outpath, format='svg', dpi=1200)

    return plt
with open(sys.argv[1]) as fp:  
	for line in fp:
		# if "Amazon" in line:
		# 	line = line.split(" doof")
		# 	date = parse(line[0])
		# 	date = date - timedelta(hours=8)
#                              unixtime = time.mktime(date.timetuple())
		# 	ar.append([unixtime,"Amazon","red"])
		# 	AWScount=AWScount+1
		if "FACEBOOK" in line:
			line = line.split(" doof")
			date = parse(line[0])
                            
			date = date - timedelta(hours=8)

			unixtime = time.mktime(date.timetuple())
			ar.append([unixtime,"Facebook","green"])
			FBcount=FBcount+1
		if "GOOGLE" in line:
			line = line.split(" doof")
			date = parse(line[0])
			date = date - timedelta(hours=8)
			unixtime = time.mktime(date.timetuple())
			ar.append([unixtime,"Google","blue"])
			Gcount=Gcount+1
		if "APPLE" in line:
			line = line.split(" doof")
			date = parse(line[0])
			date = date - timedelta(hours=8)
			unixtime = time.mktime(date.timetuple())
			ar.append([unixtime,"Apple","black"])
			APPLEcount=APPLEcount+1
                if "packet:" in line:
                    line = line.split(" doof")
                    date = parse(line[0])
                                    
                    date = date - timedelta(hours=8)

                    unixtime = time.mktime(date.timetuple())
                    ar.append([unixtime,"all","red"])
                    Ocount=Ocount+1

print ("AWS:" + str(AWScount))
print ("FACEBOOK:" + str(FBcount))
print ("GOOGLE:" + str(Gcount))
print ("APPLE:" + str(APPLEcount))
print ("other:" + str(Ocount))

plt = plot_timeline([
    (row[0], row[1], row[2])
    for row in ar
], colors=colors)

plt.show()


