#!/bin/bash

# Prepare the blog for publishing.
# The source (markdown, SCSS etc) resides in _src/
# The generated site is in _src/_site
# We want to move all the generated content into blog/

rm -rf blog/
cp -R _src/_site/ blog/
