#!/usr/bin/env bash
set -e

bucketname=dev-sdk-build-artifacts
rootDir=`pwd`
filename=$1-$(date +%Y%m%d-%H%M%S).tar.gz
packageDir=packages/$1

# veritone-widgets is a special case
#   veritone-react/redux-common packages need to be built, uploaded, and
#   linked into veritone-widgets, which will then be built itself and uploaded.
if [ "$1" = "veritone-widgets" ]; then
  # Redux
  yarn workspace veritone-redux-common run build
  mkdir -p packages/veritone-redux-common/publish-dev-dist/dist
  cp -r packages/veritone-redux-common/dist/* packages/veritone-redux-common/publish-dev-dist/dist
  cp packages/veritone-redux-common/package.json packages/veritone-redux-common/publish-dev-dist/package.json
  cd packages/veritone-redux-common/publish-dev-dist
  vReduxName=veritone-redux-common-$(date +%Y%m%d-%H%M%S).tar.gz
  tar czf $rootDir/$vReduxName ./*
  cd ..
  rm -rf ./publish-dev-dist
  cd $rootDir
  aws s3api put-object --bucket $bucketname --key $vReduxName --body $vReduxName --profile veritone
  rm $vReduxName
  vReduxS3=https://${bucketname}.s3.amazonaws.com/${vReduxName}
  echo "Created veritone-redux-common package at ${vReduxS3}"

  # React
  yarn workspace veritone-react-common run build
  mkdir -p packages/veritone-react-common/publish-dev-dist/dist
  cp -r packages/veritone-react-common/dist/* packages/veritone-react-common/publish-dev-dist/dist
  cp packages/veritone-react-common/package.json packages/veritone-react-common/publish-dev-dist/package.json
  cd packages/veritone-react-common/publish-dev-dist
  vReactName=veritone-react-common-$(date +%Y%m%d-%H%M%S).tar.gz
  tar czf $rootDir/$vReactName ./*
  cd ..
  rm -rf ./publish-dev-dist
  cd $rootDir
  aws s3api put-object --bucket $bucketname --key $vReactName --body $vReactName --profile veritone
  rm $vReactName
  vReactS3=https://${bucketname}.s3.amazonaws.com/${vReactName}
  echo "Created veritone-react-common package at ${vReactS3}"

  # Widgets
  yarn workspace $1 run build
  mkdir -p $packageDir/publish-dev-dist/dist
  cp -r $packageDir/dist/* $packageDir/publish-dev-dist/dist
  cp $packageDir/package.json $packageDir/publish-dev-dist/package.json
  cd $packageDir/publish-dev-dist
  # Link React/Redux to the current build of Widgets
  jq '.dependencies["veritone-react-common"] = "'$vReactS3'"' package.json > tmp.$$.json && mv tmp.$$.json test.json
  jq '.dependencies["veritone-redux-common"] = "'$vReduxS3'"' test.json > tmp.$$.json && mv tmp.$$.json package.json
  tar czf $rootDir/$filename ./*
  cd ..
  rm -rf ./publish-dev-dist
  cd $rootDir

  aws s3api put-object --bucket $bucketname --key $filename --body $filename --profile veritone
  rm $filename
  echo "Created veritone-widgets package at https://${bucketname}.s3.amazonaws.com/${filename}"
  echo "Finished - This build of veritone-widgets contains all changes in veritone-react/redux-common"
  # Bail out since we're done!
  exit 1
fi

# All other cases
yarn workspace $1 run build
mkdir -p $packageDir/publish-dev-dist/dist
cp -r $packageDir/dist/* $packageDir/publish-dev-dist/dist
cp $packageDir/package.json $packageDir/publish-dev-dist/package.json

cd $packageDir/publish-dev-dist
tar czf $rootDir/$filename ./*
cd ..
rm -rf ./publish-dev-dist
cd $rootDir

aws s3api put-object --bucket $bucketname --key $filename --body $filename --profile veritone
rm $filename
echo "Artifact stored at https://${bucketname}.s3.amazonaws.com/${filename}"
