#!/usr/bin/env bash
bucketname=dev-sdk-build-artifacts
pwd=$pwd

yarn run build
filename=react-common-$(date +%Y%m%d-%H%M%S).tar.gz
tar czf ${filename} dist
aws s3api put-object --bucket ${bucketname} --key ${filename} --body "`pwd`/${filename}"
rm ${filename}
echo "Artifact stored at https://${bucketname}.s3.amazonaws.com/${filename}"
