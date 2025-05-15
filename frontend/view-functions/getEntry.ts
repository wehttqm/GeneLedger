import { surfClient } from "@/utils/surfClient";
import { GENELEDGER_ABI } from "@/utils/GeneLedger_abi";

export const getEntry = async (addr: string): Promise<string[] | [string | number[] | Uint8Array<ArrayBufferLike>, string]> => {
  const content = await surfClient()
    .useABI(GENELEDGER_ABI)
    .view.get_entry({
      functionArguments: [addr as `0x${string}`],
      typeArguments: [],
    })
    .catch((error) => {
      console.error(error);
      return ["message not exist"];
    });

  const decoder = new TextDecoder();
  return [decoder.decode(hexToBytes(content[0] as string)), content[1]];
};

function hexToBytes(hex: string) {
    let bytes = [];
    for (let c = 2; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
}