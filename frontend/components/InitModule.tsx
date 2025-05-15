import { useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "@thalalabs/surf/hooks";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { GENELEDGER_ABI } from "@/utils/GeneLedger_abi";

export function InitModule() {
  const { client } = useWalletClient();
  const queryClient = useQueryClient();

  const onClickButton = async () => {
    if (!client) {
      return;
    }

    try {
      const committedTransaction = await client.useABI(GENELEDGER_ABI).post_address({
        type_arguments: [],
        arguments: [],
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
    <div className="flex flex-col gap-6">
      <Button
        onClick={onClickButton}
      >
        Post Address
      </Button>
    </div>
  );
}
