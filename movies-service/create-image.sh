#!/usr/bin/env bash

docker rm -f movies-service

docker rmi movies-service

docker image prune

docker volumn prune

# create a new image and ref to this image (-t movies-service), and base on Dockerfile in current directory
docker build -t movies-service .