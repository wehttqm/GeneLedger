#!/bin/bash

cat ceu_samples.txt | parallel --jobs 6 ' \
    echo "Processing {1}"; \
    echo {1} > tmp_sample_{1}.txt; \
    plink2 --silent --pfile ceu_subset \
        --keep tmp_sample_{1}.txt \
        --threads 2 \
        --snps-only \
        --maf 0.5 \
        --memory 640 \
        --make-pgen \
        --out samples/{1}; \
        rm tmp_sample_{1}.txt'