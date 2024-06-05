import { FolksHubOracle } from "../../chains/evm/hub/modules/index.js";
import { getHubTokensData } from "../../chains/evm/hub/utils/chain.js";
import { FolksCore } from "../core/folks-core.js";

import type { OraclePrices } from "../../chains/evm/hub/types/oracle.js";

export const read = {
  async oraclePrices(): Promise<OraclePrices> {
    const network = FolksCore.getSelectedNetwork();

    const tokensData = Object.values(getHubTokensData(network));

    return FolksHubOracle.getOraclePrices(
      FolksCore.getHubProvider(),
      network,
      tokensData,
    );
  },
};
