# ====== 配置 ======
DIST_DIR = dist
PAGES_BRANCH = gh-pages

IMAGE_TAG=$(shell cat build.json | jq .version -r)
all:
	docker build -t ineva/diff-viewer:$(IMAGE_TAG) .
	docker push ineva/diff-viewer:$(IMAGE_TAG)
