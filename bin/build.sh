rm -rf build/
cd server
./node_modules/.bin/babel src --out-dir ../build
cp package*.json ../build
cd ../client
NODE_ENV=production npm run build
mv build ../build/public