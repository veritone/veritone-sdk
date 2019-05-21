#!/usr/bin/env bash
set -e

bucketname=dev-sdk-build-artifacts
rootDir=`pwd`
filename=$1-$(date +%Y%m%d-%H%M%S).tar.gz
packageDir=packages/$1

# REQUIREMENTS:
# - `brew install jq`
# - Setup your aws veritone profile. Add the file `USER/.aws/config` with the following contents:
#     [profile veritone]
#     region=us-east-1
#     output=text

# veritone-widgets is a special case
#   veritone-react/redux-common packages need to be built, uploaded, and
#   linked into veritone-widgets, which will then be built itself and uploaded.
if [ "$1" = "all" ]; then
  vReduxDir=packages/veritone-redux-common
  vReactDir=packages/veritone-react-common
  vWidgetsDir=packages/veritone-widgets

  vReduxName=veritone-redux-common-$(date +%Y%m%d-%H%M%S).tar.gz
  vReactName=veritone-react-common-$(date +%Y%m%d-%H%M%S).tar.gz
  vWidgetsName=veritone-widgets-$(date +%Y%m%d-%H%M%S).tar.gz

  # Redux
  yarn workspace veritone-redux-common run build
  mkdir -p $vReduxDir/publish-dev-dist/dist
  cp -r $vReduxDir/dist/* $vReduxDir/publish-dev-dist/dist
  cp $vReduxDir/package.json $vReduxDir/publish-dev-dist/package.json
  cd $vReduxDir/publish-dev-dist
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
  mkdir -p $vReactDir/publish-dev-dist/dist
  cp -r $vReactDir/dist/* $vReactDir/publish-dev-dist/dist
  cp $vReactDir/package.json $vReactDir/publish-dev-dist/package.json
  cd $vReactDir/publish-dev-dist
  tar czf $rootDir/$vReactName ./*
  cd ..
  rm -rf ./publish-dev-dist
  cd $rootDir
  aws s3api put-object --bucket $bucketname --key $vReactName --body $vReactName --profile veritone
  rm $vReactName
  vReactS3=https://${bucketname}.s3.amazonaws.com/${vReactName}
  echo "Created veritone-react-common package at ${vReactS3}"

  # Widgets
  yarn workspace veritone-widgets run build
  mkdir -p $vWidgetsDir/publish-dev-dist/dist
  cp -r $vWidgetsDir/dist/* $vWidgetsDir/publish-dev-dist/dist
  cp $vWidgetsDir/package.json $vWidgetsDir/publish-dev-dist/package.json
  cd $vWidgetsDir/publish-dev-dist
  # Link React/Redux to the current build of Widgets
  jq '.dependencies["veritone-react-common"] = "'$vReactS3'"' package.json > tmp.$$.json && mv tmp.$$.json test.json
  jq '.dependencies["veritone-redux-common"] = "'$vReduxS3'"' test.json > tmp.$$.json && mv tmp.$$.json package.json
  tar czf $rootDir/$vWidgetsName ./*
  cd ..
  rm -rf ./publish-dev-dist
  cd $rootDir

  aws s3api put-object --bucket $bucketname --key $vWidgetsName --body $vWidgetsName --profile veritone
  rm $vWidgetsName
  vWidgetsS3=https://${bucketname}.s3.amazonaws.com/${vWidgetsName}

  # Re-echo subpackages since we may need to reference them in some cases
  echo "Created veritone-redux-common package at ${vReduxS3}"
  echo "Created veritone-react-common package at ${vReactS3}"
  echo "Created veritone-widgets package at ${vWidgetsS3}"
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
