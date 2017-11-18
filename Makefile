gh-pages:
	npm run build && git checkout gh-pages && git add js && git add css && git add impulses && git add index.html && git commit -m "generate GitHub page" && git push && git checkout master
