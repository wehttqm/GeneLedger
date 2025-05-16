Where is the demo video?? In progress uploading! Come back please in 10 minutes.
# What is Gene Ledger?
In the age of data, I do not believe we should let DNA become just another data point to sell people targeted drugs and predict behaviour. That said, ancestry services are really cool and can be used to improve health and proactively prevent disease, but it is at the cost of your data. Gene Ledger wants to fix this. 

Gene Ledger is a privacy first Ancestry service that has its data decentralized, yet stored extremely securely using a variety of techniques such as homomorphic encryption to enable kinship relationship checking and trait matching without ever revealing the underlying data to anyone. This solves the problem of ancestry services being able to sell your data to advertisers, which is a massive deal especially now as 23andme has went bankrupt and their main asset listed in their case is their users data. We built this on top of Aptos, primarily to store pointer addresses and enable authentication of ones data. All data is encrypted by the client and stored in a IPFS, that allows other users to compare their DNA against others, without actually revealing it, for the purpose of checking ancestry relationships.

## Tech
Typescript/Tanstack/Vite frontend to host. The backend we have to process data is a Python FastAPI, and the IPFS database used is from Pinata. 

Aptos blockchain was used for verification and encryption of the data, primarily to track relationships between DNA samples and other data, stored per-account, which is a very important feature that enabled us to store sensitive keys on the blockchain that is accessible to the user but no one else.
