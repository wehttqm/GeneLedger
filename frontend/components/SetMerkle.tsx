import { useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "@thalalabs/surf/hooks";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { GENELEDGER_ABI } from "@/utils/GeneLedger_abi";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { createHash } from "crypto";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function SetMerkle() {
  const { client } = useWalletClient();
  const queryClient = useQueryClient();

  const [string, setString] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = (): Promise<string[]> => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return Promise.resolve([]);
    }

    const lineArray: string[] = [];

    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();
      let i = 0;
      reader.onerror = reject;
      reader.readAsText(selectedFile);
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        for (const line of lines) {
          if (i === 0) {
            i++;
            continue;
          }
          const string = line.split("\t").join("").replace(/\r/g, "");
          lineArray.push(createHash("sha256").update(string).digest("hex"));
          i++;
          if (i === 1000) {
            break;
          }
        }
        resolve(lineArray);
      };
    });
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const onClickButton = async () => {
    if (!client) {
      return;
    }

    const lineHashes = await handleUpload();

    const encoder = new TextEncoder();
    const hashes = [];
    for (const hash of lineHashes) {
      hashes.push(Array.from(encoder.encode(hash)));
    }

    console.log(hashes);

    try {
      const committedTransaction = await client
        .useABI(GENELEDGER_ABI)
        .store_entry({
          type_arguments: [],
          arguments: [
            Array.from(encoder.encode(string)),
            hashes,
            Number(new Date().getTime()),
          ],
        });
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      queryClient.invalidateQueries({
        queryKey: ["message-content"],
      });
      toast({
        title: "Success",
        description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { network } = useWallet();

  return (
    <div className="flex flex-col gap-y-2">
      <Button onClick={onClickButton}>
        Hash DNA & Upload to {network?.name}
      </Button>
      <div className="flex space-x-2">
        <Input
          placeholder="Pointer"
          value={string}
          onChange={(e) => setString(e.target.value)}
        ></Input>
        <Input disabled value={"new Date().getTime()"}></Input>
        <div className="">
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleButtonClick}>
              {selectedFile ? selectedFile.name : "Choose File"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
