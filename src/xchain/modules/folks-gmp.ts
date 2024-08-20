import { getEvmSignerAddress } from "../../chains/evm/common/utils/chain.js";
import { encodeRetryMessageExtraArgs, encodeReverseMessageExtraArgs } from "../../chains/evm/common/utils/gmp.js";
import { FolksHubGmp } from "../../chains/evm/hub/modules/index.js";
import { getHubChain } from "../../chains/evm/hub/utils/chain.js";
import { FolksEvmGmp } from "../../chains/evm/spoke/modules/index.js";
import { assertHubChainSelected, getSpokeChain } from "../../common/utils/chain.js";
import { FolksCore } from "../core/folks-core.js";

import type {
  MessageReceived,
  RetryMessageExtraArgs,
  ReverseMessageExtraArgs,
} from "../../chains/evm/common/types/gmp.js";
import type { PrepareReverseMessageCall } from "../../chains/evm/common/types/module.js";
import type { ChainType } from "../../common/types/chain.js";
import type { MessageId } from "../../common/types/gmp.js";
import type { AdapterType } from "../../common/types/message.js";
import type { PrepareRetryMessageCall } from "../../common/types/module.js";

export const prepare = {
  async retryMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    value: bigint,
    message: MessageReceived,
    extraArgs: RetryMessageExtraArgs | undefined,
    isHub = true,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const encodedExtraArgs = encodeRetryMessageExtraArgs(extraArgs);

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.prepare.retryMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getHubChain(folksChain.network),
      );
    } else {
      return await FolksEvmGmp.prepare.retryMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getSpokeChain(folksChain.folksChainId, folksChain.network),
      );
    }
  },

  async reverseMessage(
    adapterId: AdapterType,
    messageId: MessageId,
    message: MessageReceived,
    extraArgs: ReverseMessageExtraArgs | undefined,
    value: bigint,
    isHub = true,
  ) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const encodedExtraArgs = encodeReverseMessageExtraArgs(extraArgs);

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.prepare.reverseMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getHubChain(folksChain.network),
      );
    } else {
      return await FolksEvmGmp.prepare.reverseMessage(
        FolksCore.getProvider<ChainType.EVM>(folksChain.folksChainId),
        getEvmSignerAddress(FolksCore.getSigner()),
        adapterId,
        messageId,
        message,
        encodedExtraArgs,
        value,
        getSpokeChain(folksChain.folksChainId, folksChain.network),
      );
    }
  },
};

export const write = {
  async retryMessage(adapterId: AdapterType, messageId: MessageId, prepareCall: PrepareRetryMessageCall) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { isHub } = prepareCall;

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.write.retryMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    } else {
      return await FolksEvmGmp.write.retryMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    }
  },

  async reverseMessage(adapterId: AdapterType, messageId: MessageId, prepareCall: PrepareReverseMessageCall) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { isHub } = prepareCall;

    if (isHub) {
      assertHubChainSelected(folksChain.folksChainId, folksChain.network);
      return await FolksHubGmp.write.reverseMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    } else {
      return await FolksEvmGmp.write.reverseMessage(
        FolksCore.getHubProvider(),
        FolksCore.getSigner<ChainType.EVM>(),
        adapterId,
        messageId,
        prepareCall,
      );
    }
  },
};
