#!/bin/fish

echo "What should the version be?"
read VERSION

docker build -t csandoval18/forum-app:$VERSION .
docker push csandoval18/forum-app:$VERSION 
ssh root@68.183.31.160 "docker pull csandoval18/forum-app:$VERSION && docker tag csandoval18/forum-app:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"