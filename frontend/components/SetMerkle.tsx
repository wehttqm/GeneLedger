import { useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "@thalalabs/surf/hooks";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { GENELEDGER_ABI } from "@/utils/GeneLedger_abi";
import { Input } from "./ui/input";
import { useState } from "react";

export function SetMerkle() {
  const { client } = useWalletClient();
  const queryClient = useQueryClient();

  const [string, setString] = useState("");

  const onClickButton = async () => {
    if (!client) {
      return;
    }

    try {
      const encoder = new TextEncoder();
      const committedTransaction = await client.useABI(GENELEDGER_ABI).store_entry({
        type_arguments: [],
        arguments: [Array.from(encoder.encode(string)), Number(new Date().getTime())],
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

  return (
    <div className="flex flex-col gap-y-2">
      <Button
        onClick={onClickButton}
      >
        Store Entry
      </Button>
      <div className='flex space-x-2'>
        <Input placeholder="string" value={string} onChange={(e) => setString(e.target.value)}></Input>
        <Input disabled value={"new Date().getTime()"}></Input>
      </div>
    </div>
  );
}

