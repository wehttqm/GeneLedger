import { useWalletClient } from "@thalalabs/surf/hooks";
// Internal components
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { getEntry } from "@/view-functions/getEntry";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function AddressView({ addr }: { addr: string }) {
  const { client } = useWalletClient();
  const [entry, setEntry] = useState<string[] | [string | number[] | Uint8Array<ArrayBufferLike>, string] | null>(null);

  const fetchEntry = async () => {
    if (!client || entry !== null) {
      return;
    }

    try {
      setEntry(await getEntry(addr));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) fetchEntry();
      }}
    >
      <DialogTrigger asChild>
        <div className="p-1 rounded-lg hover:cursor-pointer hover:bg-slate-100 hover:scale-105 transition-all">
          {addr}
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>On-chain Account Entry</DialogTitle>
          <span className="">{addr.substring(0, 8)}...</span>
        </DialogHeader>
        {entry ? (
          <Table className="flex">
            <TableBody className='w-full'>
              <TableRow className='w-full'>
                <TableCell className="font-medium w-full">Pointer</TableCell>
                <TableCell>{entry[0]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Timestamp</TableCell>
                <TableCell>{entry[1]}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <span>AddressView: Failed to resolve data.</span>
        )}
      </DialogContent>
    </Dialog>
  );
}
