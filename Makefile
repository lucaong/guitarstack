gh-pages:
	 git checkout gh-pages && npm run build && mkdir -p js && git add js && git commit -m "generate GitHub page" && git push && git checkout master
