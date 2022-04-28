#!/usr/bin/env bash

# get WEBCAM_PORT_STREAM env variable and if not fallback to 9999
PORT="${WEBCAM_PORT_STREAM:-9999}"

# video and audio
# ffmpeg -f v4l2 -video_size 640x480 -framerate 30 -i /dev/video0 -f alsa -ar 44100 -ac 2 -i hw:0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -codec:a mp2 -b:a 128k -muxdelay 0.001 http://127.0.0.1:$PORT

# only video (note the fps is also depending on the camera params so setting -framerate may not work at all)
ffmpeg -f v4l2 -i /dev/video0 -video_size 640x480 -framerate 30 \
       -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -flush_packets 0 http://127.0.0.1:$PORT
