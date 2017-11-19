gh-pages:
	 git checkout gh-pages && git merge master && npm run build && mkdir -p js && git add js && git commit -m "generate GitHub page" && git push origin gh-pages && git checkout master
