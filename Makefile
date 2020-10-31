PHONY: github

github:
	rm -rf docs
	cp -r ssr docs
	git add -A
	git commit -m "update github pages"
	git push
