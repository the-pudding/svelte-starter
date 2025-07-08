PHONY: github pudding

github:
	rm -rf docs
	cp -r build docs
	touch docs/.nojekyll
	git add -A
	git commit -m "update github pages"
	git push

protect:
	cd build && npx staticrypt --short index.html -p $(shell grep PASSWORD .env | cut -d '=' -f2) -d .

staging: 
	npm run build
	make github

production:
	npm run build
	make pudding

# aws-sync:
# 	aws s3 sync build s3://pudding.cool/year/month/name --delete --cache-control 'max-age=31536000'

# aws-cache:
# 	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/year/month/name*'	

# pudding: aws-sync aws-cache