import { getEvmSignerAddress } from "../../chains/evm/common/utils/chain.js";
import { FolksHubGmp } from "../../chains/evm/hub/modules/index.js";
import { getHubChain } from "../../chains/evm/hub/utils/chain.js";
import { assertHubChainSelected } from "../../common/utils/chain.js";
import { FolksCore } from "../core/folks-core.js";

import type { PrepareReverseMessageCall } from "../../chains/evm/common/types/module.js";
import type { ChainType } from "../../common/types/chain.js";
import type { MessageId, ReverseMessageExtraAgrs } from "../../common/types/gmp.js";
import type { AdapterType } from "../../common/types/message.js";
import type { PrepareRetryMessageCall } from "../../common/types/module.js";

export const prepare = {
  async retryMessage(adapterId: AdapterType, messageId: MessageId, value: bigint) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubGmp.prepare.retryMessage(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      getEvmSignerAddress(FolksCore.getSigner()),
      adapterId,
      messageId,
      value,
      getHubChain(folksChain.network),
    );
  },

  async reverseMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    extraArgs: ReverseMessageExtraAgrs,
    value: bigint,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubGmp.prepare.reverseMessage(
      FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
      getEvmSignerAddress(FolksCore.getSigner()),
      adapterId,
      messageId,
      extraArgs,
      value,
      getHubChain(folksChain.network),
    );
  },
};

export const write = {
  async retryMessage(adapterId: AdapterType, messageId: MessageId, prepareCall: PrepareRetryMessageCall) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubGmp.write.retryMessage(
      FolksCore.getHubProvider(),
      FolksCore.getSigner<ChainType.EVM>(),
      adapterId,
      messageId,
      prepareCall,
    );
  },

  async reverseMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    extraArgs: ReverseMessageExtraAgrs,
    prepareCall: PrepareReverseMessageCall,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();

    assertHubChainSelected(folksChain.folksChainId, folksChain.network);

    return await FolksHubGmp.write.reverseMessage(
      FolksCore.getHubProvider(),
      FolksCore.getSigner<ChainType.EVM>(),
      adapterId,
      messageId,
      extraArgs,
      prepareCall,
    );
  },
};
