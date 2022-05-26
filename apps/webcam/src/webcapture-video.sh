#!/usr/bin/env bash

# allow setting duration as second optional parameter
# $ ./webcapture-video.sh video.mp4 5     - will capture a 5 seconds video
# $ ./webcapture-video.sh video.mp4       - will capture a 10 seconds video
DUR_DEF=10
DUR=${2:-$DUR_DEF}

# take video/audio for some duration (in seconds)
#      -f alsa -i hw:0 -acodec aac -ac 2 -ab 32k -ar 44100
ffmpeg -y \
       -f v4l2 -r 25 -s 640x480 -i /dev/video0 \
       -t $DUR \
       -f mpegts $1