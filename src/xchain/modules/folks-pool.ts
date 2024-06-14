import { FolksHubPool } from "../../chains/evm/hub/modules/index.js";
import { FolksCore } from "../core/folks-core.js";

import type { PoolInfo } from "../../chains/evm/hub/types/pool.js";
import type { FolksTokenId } from "../../common/types/token.js";

export const read = {
  async poolInfo(folksTokenId: FolksTokenId): Promise<PoolInfo> {
    return FolksHubPool.getPoolInfo(FolksCore.getHubProvider(), FolksCore.getSelectedNetwork(), folksTokenId);
  },
};
