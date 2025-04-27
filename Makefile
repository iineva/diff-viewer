IMAGE_TAG=$(shell cat build.json | jq .version -r)
all:
	docker build -t ineva/diff-viewer:$(IMAGE_TAG) .
	docker push ineva/diff-viewer:$(IMAGE_TAG)
