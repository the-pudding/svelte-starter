PHONY: github

github:
	rm -rf docs
	# cp -r __sapper__/export/svelte-starter docs
	cp -r public docs
	git add -A
	git commit -m "update github pages"
	git push
