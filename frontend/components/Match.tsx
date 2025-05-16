import { getAddresses } from "@/view-functions/getAddresses";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useState } from "react";
import { Button } from "./ui/button";
import { getEntry } from "@/view-functions/getEntry";
import { Card, CardContent } from "./ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

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
      const res = await fetch(`http://localhost:8000/get/$${pointer}`, {
        method: "post",
      });
      const matches = await res.json();
      if (matches) {
        setMatches(matches);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Button onClick={getMatches}>Compute Matches</Button>
      {matches.map((match) => {
        return (
          <div key={JSON.stringify(match)}>
            <Card>
              <CardContent className="">{JSON.stringify(match)}</CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
