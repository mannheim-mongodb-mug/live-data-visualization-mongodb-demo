#!/bin/sh
# change to directory of this script, mongodb paths are releative to this file.
cd ${0%/*}
mkdir data
mongod --config mongodb.config
echo "started mongod"