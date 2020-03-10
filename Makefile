PHONY: github aws-sync aws-cache pudding

github:
	rm -rf docs
	cp -r __sapper__/export/svelte-hmr-sapper docs
	git add -A
	git commit -m "update dev version"
	git push
	
aws-sync:
	aws s3 sync __sapper__/export/year/month/name s3://pudding.cool/year/month/name --delete --cache-control 'max-age=31536000'

aws-cache:
	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/year/month/name*'	

pudding: aws-sync aws-cache