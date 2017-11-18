gh-pages:
	npm run build && git checkout gh-pages && git add js && git commit -m "generate GitHub page" && git push && git checkout master
