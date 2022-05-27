#!/usr/bin/env bash

# take just one image
# ffmpeg -f v4l2 -i /dev/video0 -f singlejpeg -frames:v 1 -qscale:v $1

# use fswebcam  (delay 2 secs and skip first 2 frames) - save it as the passed 1-st argument
# fswebcam --device v4l2:/dev/video0 --delay 2 --skip 2 --frames 1 ./public/history/image.jpg
# NOTE: The output image is overwritten (this is useful in this case)
fswebcam --device v4l2:/dev/video0 --delay 2 --skip 2 --frames 1 $1


# for knowage: The  PNG or JPEG image can be sent to stdio using the filename "-".
# The output filename is formatted by strftime.
# "fswebcam -""
# a unnecessay example - redirect stdout to a a file so:
# "fswebcam - > image.jpg" will save it also to image.jpg, same as just "fswebcam image.jpg"