import { AccountInfo } from "./AccountInfo";
import { GetAddresses } from "./GetAddresses";
import { NetworkInfo } from "./NetworkInfo";
import { Card, CardContent } from "./ui/card";
import { WalletDetails } from "./WalletDetails";

export const Info = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-2 pt-4">
          <GetAddresses />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-2 pt-4">
          <WalletDetails />
          <NetworkInfo />
          <AccountInfo />
        </CardContent>
      </Card>
    </div>
  );
};
