#!/bin/fish

echo "What should the version be?"
read VERSION

docker build -t csandoval18/forum-app:$VERSION .
docker push csandoval18/forum-app:$VERSION 
ssh root@164.90.252.96 "docker pull csandoval18/forum-app:$VERSION && docker tag csandoval18/forum-app:$VERSION api:$VERSION && dokku deploy api $VERSION"