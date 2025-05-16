#!/bin/bash

# Script aiming to cut down data from ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/hd_genotype_chip/ALL.chip.omni_broad_sanger_combined.20140818.snps.genotypes.vcf.gz
# Only remaining data will relate to informative SNPs for traits and familial links, put in more readable format


if [ $# -eq 0 ]; then
    echo "Bad Arg"
    exit 1;
fi

rm ceu* kin*

##
## Step 1 : Get specific population (CEU), process into own uncompressed VCF
## 

dataset=$(basename "$1" .vcf.gz)
output_samples="ceu_samples.txt"

# Grab all sample IDs from CEU data file
cut -f1 igsr-ceu.tsv.tsv > all_samples.txt
tail -n 50 "all_samples.txt" > "ceu_samples.txt" # Remove header

# Add three confirmed related (Child, Mom, Dad)
echo "NA12878" >> "ceu_samples.txt"
echo "NA12891" >> "ceu_samples.txt"
echo "NA12892" >> "ceu_samples.txt"

echo "Sample Set Generated"

# Put all samples in CEU into their own VCF
bcftools view -S ceu_samples.txt -Oz -o ceu_subset.vcf.gz $dataset.vcf.gz --force-samplesl
bcftools index ceu_subset.vcf.gz

echo "Subset Created"

bcftools view -Oz -o ceu_filtered.vcf.gz ceu_subset.vcf.gz \
    -r 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22 \
    -e 'INFO/AF=0 || INFO/AF=1 || FMT/GT="." || QUAL<20 || TYPE!="snp"' \
    -v snps \
    -g ^miss \
    -m2 -M2
bcftools index ceu_filtered.vcf.gz

echo "Indexed and created optimized subset"

##
## Plink Format
##

# Convert to PLINK compatible formats, exclude chromosones 1-22, gender info missing
plink2 --vcf ceu_filtered.vcf.gz --make-pgen --out ceu_subset --chr 1-22 --indep-pairwise 50 5 0.2
