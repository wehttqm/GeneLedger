#!/bin/bash

# Scripts to setup the environment to allow for gene comparison
# Use Linux

sudo apt-get install parallel plink2 bcftools python3 python3-multipart

# Python Stuffs
python3 -m venv .venv
pip install fastapi[standard]

# Consider reading into ./scripts/convert_combine to download a dataset of 180 of parents, childrens, brothers
# See population https://www.internationalgenome.org/data-portal/population/CEU