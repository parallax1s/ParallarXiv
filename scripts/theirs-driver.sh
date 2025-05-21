#!/bin/sh
# Custom merge driver that keeps the version from the merging branch
# Usage: git merge will supply %O %A %B as parameters
# We simply copy the other branch's file (%B) over ours (%A)
cp "$3" "$2"
# Comment added for conflict testing
