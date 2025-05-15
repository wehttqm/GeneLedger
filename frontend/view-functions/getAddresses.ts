import { surfClient } from "@/utils/surfClient";
import { GENELEDGER_ABI } from "@/utils/GeneLedger_abi";

export const getAddresses = async (): Promise<string | string[]> => {
  const content = await surfClient()
    .useABI(GENELEDGER_ABI)
    .view.get_addresses({
      functionArguments: [],
      typeArguments: [],
    })
    .catch((error) => {
      console.error(error);
      return ["message not exist"];
    });

  return content[0];
};
