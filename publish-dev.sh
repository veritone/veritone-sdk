#!/usr/bin/env bash
set -e

bucketname=dev-sdk-build-artifacts
rootDir=`pwd`
filename=$1-$(date +%Y%m%d-%H%M%S).tar.gz
packageDir=packages/$1

yarn workspace $1 run build
mkdir -p $packageDir/publish-dev-dist/dist
cp $packageDir/dist/* $packageDir/publish-dev-dist/dist
cp $packageDir/package.json $packageDir/publish-dev-dist/dist/package.json

cd $packageDir
tar czf $rootDir/$filename ./publish-dev-dist
rm -rf ./publish-dev-dist
cd $rootDir

aws s3api put-object --bucket $bucketname --key $filename --body $filename
rm $filename
echo "Artifact stored at https://${bucketname}.s3.amazonaws.com/${filename}"
