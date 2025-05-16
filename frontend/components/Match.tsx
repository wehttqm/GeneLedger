import { getAddresses } from "@/view-functions/getAddresses";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useState } from "react";
import { Button } from "./ui/button";
import { getEntry } from "@/view-functions/getEntry";
import { Card, CardContent } from "./ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type Match = {
  id: string;
  relationship: string;
  shared_dna: number;
};

export const Match = () => {
  const { client } = useWalletClient();
  const { account } = useWallet();
  const [matches, setMatches] = useState<Match[]>([]);

  const getPointer = async () => {
    if (!client) {
      return null;
    }

    const address = account?.address;

    if (address) {
      const entry = await getEntry(address.toString());
      return entry[0];
    }
    return null;
  };

  const getMatches = async () => {
    const pointer = await getPointer();
    if (pointer) {
      console.log("pointer retrieved");
      const res = await fetch(`http://localhost:8000/get/$${pointer}`, {
        method: "post",
      });
      const matches = await res.json();
      if (matches) {
        setMatches(matches);
      }
    } else {
      console.log("Error: pointer not defined");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Button onClick={getMatches}>Compute Matches</Button>
      {matches.length > 0 &&
        `Generated ${matches.length} match${matches.length > 1 ? "es" : ""}.`}
      {matches.map((match) => {
        return (
          <div key={JSON.stringify(match)}>
            <Card>
              <CardContent className="">
                <Table className="flex">
                  <TableBody className="w-full">
                    <TableRow className="w-full">
                      <TableCell className="font-medium w-full">
                        Pointer
                      </TableCell>
                      <TableCell>{match.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Predicted Relationship
                      </TableCell>
                      <TableCell>{match.relationship}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Kinship Relationship Score
                      </TableCell>
                      <TableCell>{match.shared_dna}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
