#!/bin/bash

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >.npmrc

echo "Token length: ${#NPM_TOKEN}"

cd ./packages

cd react-use-snack
cp README.md build/ && cp ../../LICENSE build/
cd ../

cd ../

#npm run release
npm run release -- --yes

rm .npmrc
