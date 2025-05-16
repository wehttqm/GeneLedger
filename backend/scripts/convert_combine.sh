#!/bin/bash

plink2 --vcf ./samples/$1.vcf.gz --make-pgen --out ./samples/$1 --chr 1-22 --indep-pairwise 50 5 0.2 > /dev/null 2>&1
plink2 --pmerge-list merge_list.txt --out merged_data --make-pgen > /dev/null 2>&1

# KINSHIP
echo $1 > tmp_sample_hold.txt
plink2 --pfile ceu_subset --make-king-table --out kinship_results --king-table-require tmp_sample_hold.txt > /dev/null 2>&1
awk '$6 >= 0.01' kinship_results.kin0 # Output only this such that it can be parsed