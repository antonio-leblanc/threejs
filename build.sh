echo ''
echo ' ==== THREEjs BUILDER ===='
echo 'npm build'
npm run build

echo 'git push main'
git add . 
git commit -m 'new build'
git push

echo 'git push gh-pages'
git subtree push --prefix dist origin gh-pages
echo ''
echo ' ==== THREEjs BUILDER ===='
echo ''