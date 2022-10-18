cd `dirname $0`
echo "Pulling any updates..."
git pull
echo "Building..."
npm run build
echo "Executing..."
node host.js
