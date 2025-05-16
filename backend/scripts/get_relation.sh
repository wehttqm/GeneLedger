#!/bin/bash

echo $1 > tmp_file.txt
plink2 --pfile ceu_subset --make-king-table --out kinship_results --king-table-require tmp_file.txt
awk '$6 >= 0.01' kinship_results.kin0 > $1.out
rm tmp_file.txt
