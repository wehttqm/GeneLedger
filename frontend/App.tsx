import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletDetails } from "@/components/WalletDetails";
import { AccountInfo } from "@/components/AccountInfo";
import { PostAddress } from "./components/PostAddress";
import { SetMerkle } from "./components/SetMerkle";
import { GetAddresses } from "./components/GetAddresses";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { WalletSelector } from "./components/WalletSelector";
import { Upload } from "./components/Upload";
import { Match } from "./components/Match";
import { Info } from "./components/Info";

function App() {
  const { connected } = useWallet();
  const [section, setSection] = useState("Upload");
  return (
    <div className="flex flex-col w-full h-screen font-besley">
      <div className="flex items-center px-8 py-4">
        <span className="w-1/3">GeneLedger</span>
        <div className="flex items-center justify-between space-x-20 w-1/3">
          <Button
            onClick={() => setSection("Upload")}
            variant={section == "Upload" ? "default" : "outline"}
          >
            Upload
          </Button>
          <Button
            onClick={() => setSection("Match")}
            variant={section == "Match" ? "default" : "outline"}
          >
            Match
          </Button>
          <Button
            onClick={() => setSection("Info")}
            variant={section == "Info" ? "default" : "outline"}
          >
            Info
          </Button>
        </div>
        <div className="flex gap-2 justify-end items-center flex-wrap w-1/3">
          <WalletSelector />
        </div>
      </div>
      <div className="flex h-[90%] items-center justify-center flex-col">
        {connected ? (
          section == "Upload" ? (
            <Upload />
          ) : section == "Match" ? (
            <Match />
          ) : section == "Info" ? (
            <Info />
          ) : (
            <div></div>
          )
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </div>
  );
}

export default App;
