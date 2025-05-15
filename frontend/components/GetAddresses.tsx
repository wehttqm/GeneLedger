import { useWalletClient } from "@thalalabs/surf/hooks";
// Internal components
import { Button } from "@/components/ui/button";
import { getAddresses } from "@/view-functions/getAddresses";
import { useState } from "react";
import { AddressView } from "./AddressView";

export function GetAddresses() {
  const { client } = useWalletClient();
  const [addresses, setAddresses] = useState<string | string[]>("");

  const onClickButton = async () => {
    if (!client) {
      return;
    }

    try {
      setAddresses(await getAddresses());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Button onClick={onClickButton}>Get Addresses</Button>
      {Array.isArray(addresses) && (
        <div className="flex flex-col space-y-4 items-center">
          {addresses.map((addr) => {
            return <AddressView key={addr} addr={addr}/>
          })}
        </div>
      )}
    </div>
  );
}
