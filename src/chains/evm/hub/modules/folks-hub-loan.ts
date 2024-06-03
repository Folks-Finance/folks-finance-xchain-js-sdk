import { multicall } from "viem/actions";

import { UINT256_LENGTH } from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { Action } from "../../../../common/types/message.js";
import { getRandomGenericAddress } from "../../../../common/utils/address.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";
import {
  getSpokeChain,
  getSpokeTokenData,
} from "../../../../common/utils/chain.js";
import { calcRewardIndex } from "../../../../common/utils/formulae.js";
import {
  DEFAULT_MESSAGE_PARAMS,
  buildMessagePayload,
  buildSendTokenExtraArgsWhenRemoving,
} from "../../common/utils/message.js";
import {
  getHubChain,
  getHubTokenAddress,
  getHubTokenData,
} from "../utils/chain.js";
import {
  getBridgeRouterHubContract,
  getLoanManagerContract,
} from "../utils/contract.js";

import type {
  FolksChainId,
  NetworkType,
} from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type {
  MessageAdapters,
  MessageToSend,
} from "../../../../common/types/message.js";
import type { LoanType } from "../../../../common/types/module.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type {
  AbiLoanPool,
  AbiUserLoan,
  LoanPoolInfo,
  LoanTypeInfo,
  UserLoanInfo,
} from "../types/loan.js";
import type { OraclePrices } from "../types/oracle.js";
import type { PoolInfo } from "../types/pool.js";
import type { HubTokenData } from "../types/token.js";
import type { Client, ContractFunctionParameters } from "viem";

export function getSendTokenAdapterFees(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  folksTokenId: FolksTokenId,
  amount: bigint,
  receiverFolksChainId: FolksChainId,
  adapters: MessageAdapters,
): () => Promise<bigint> {
  return async (): Promise<bigint> => {
    const hubChain = getHubChain(network);
    const hubTokenData = getHubTokenData(folksTokenId, network);
    const hubBridgeRouter = getBridgeRouterHubContract(
      provider,
      hubChain.bridgeRouterAddress,
    );

    const spokeChain = getSpokeChain(receiverFolksChainId, network);
    const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

    // construct return message
    const { returnAdapterId } = adapters;
    const returnParams = DEFAULT_MESSAGE_PARAMS({
      adapterId: returnAdapterId,
      returnAdapterId,
    });
    const returnMessage: MessageToSend = {
      params: returnParams,
      sender: hubChain.hubAddress,
      destinationChainId: receiverFolksChainId,
      handler: getRandomGenericAddress(),
      payload: buildMessagePayload(
        Action.SendToken,
        accountId,
        getRandomGenericAddress(),
        convertNumberToBytes(amount, UINT256_LENGTH),
      ),
      finalityLevel: FINALITY.FINALISED,
      extraArgs: buildSendTokenExtraArgsWhenRemoving(
        hubTokenData.tokenType,
        spokeTokenData.spokeAddress,
        getHubTokenAddress(hubTokenData),
        amount,
      ),
    };

    // get return adapter fee
    return await hubBridgeRouter.read.getSendFee([returnMessage]);
  };
}

export async function loanTypeInfo(
  provider: Client,
  network: NetworkType,
  loanTypeId: LoanType,
  tokens: Array<HubTokenData>,
): Promise<LoanTypeInfo> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(
    provider,
    hubChain.loanManagerAddress,
  );

  const getLoanPools: Array<ContractFunctionParameters> = tokens.map(
    (token) => ({
      address: loanManager.address,
      abi: loanManager.abi,
      functionName: "getLoanPool",
      args: [loanTypeId, token.poolId],
    }),
  );

  const [deprecated, loanTargetHealth, ...loanPools] = await multicall(
    provider,
    {
      contracts: [
        {
          address: loanManager.address,
          abi: loanManager.abi,
          functionName: "isLoanTypeDeprecated",
          args: [loanTypeId],
        },
        {
          address: loanManager.address,
          abi: loanManager.abi,
          functionName: "getLoanTypeLoanTargetHealth",
          args: [loanTypeId],
        },
        ...getLoanPools,
      ],
      allowFailure: false,
    },
  );

  const pools: Partial<Record<FolksTokenId, LoanPoolInfo>> = {};
  for (let i = 0; i < loanPools.length; i++) {
    const token = tokens[i];
    const {
      collateralUsed,
      borrowUsed,
      collateralCap,
      borrowCap,
      collateralFactor,
      borrowFactor,
      liquidationBonus,
      liquidationFee,
      isDeprecated,
      reward,
    } = (loanPools as Array<AbiLoanPool>)[i];
    const {
      lastUpdateTimestamp,
      minimumAmount,
      collateralSpeed,
      borrowSpeed,
      collateralRewardIndex: oldCollateralRewardIndex,
      borrowRewardIndex: oldBorrowRewardIndex,
    } = reward;

    pools[token.folksTokenId] = {
      folksTokenId: token.folksTokenId,
      poolId: token.poolId,
      collateralUsed,
      borrowUsed,
      collateralCap,
      borrowCap,
      collateralFactor: [BigInt(collateralFactor), 4],
      borrowFactor: [BigInt(borrowFactor), 4],
      liquidationBonus: [BigInt(liquidationBonus), 4],
      liquidationFee: [BigInt(liquidationFee), 4],
      isDeprecated,
      reward: {
        minimumAmount,
        collateralSpeed: [BigInt(collateralSpeed), 18],
        borrowSpeed: [BigInt(borrowSpeed), 18],
        collateralRewardIndex: calcRewardIndex(
          collateralUsed,
          minimumAmount,
          [BigInt(oldCollateralRewardIndex), 18],
          [BigInt(collateralSpeed), 18],
          lastUpdateTimestamp,
        ),
        borrowRewardIndex: calcRewardIndex(
          borrowUsed,
          minimumAmount,
          [BigInt(oldBorrowRewardIndex), 18],
          [BigInt(borrowSpeed), 18],
          lastUpdateTimestamp,
        ),
      },
    };
  }

  return {
    loanTypeId,
    deprecated: deprecated as boolean,
    loanTargetHealth: [BigInt(loanTargetHealth as number), 4],
    pools,
  };
}

export async function getUserLoanIds(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
): Promise<Array<LoanId>> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(
    provider,
    hubChain.loanManagerAddress,
  );

  // loan ids can be reused so must include if created more times than deleted
  const loanIds = new Map<LoanId, number>();

  // add created
  const createLogs = await loanManager.getEvents.CreateUserLoan(
    { accountId },
    { strict: true },
  );
  for (const log of createLogs) {
    const loanId = log.args.loanId as LoanId;
    const num = loanIds.get(loanId) ?? 0;
    loanIds.set(loanId, num + 1);
  }

  // remove deleted
  const deletedLogs = await loanManager.getEvents.DeleteUserLoan(
    { accountId },
    { strict: true },
  );
  for (const log of deletedLogs) {
    const loanId = log.args.loanId as LoanId;
    const num = loanIds.get(loanId) ?? 1;
    num === 1 ? loanIds.delete(loanId) : loanIds.set(loanId, num - 1);
  }

  // return remaining
  return Array.from(loanIds.keys());
}

export async function userLoansInfo(
  provider: Client,
  network: NetworkType,
  loanIds: Array<LoanId>,
  poolsInfo: Partial<Record<FolksTokenId, PoolInfo>>,
  loanTypesInfo: Partial<Record<LoanType, LoanTypeInfo>>,
  oraclePrices: OraclePrices,
): Promise<Record<LoanId, UserLoanInfo>> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(
    provider,
    hubChain.loanManagerAddress,
  );

  const getUserLoans: Array<ContractFunctionParameters> = loanIds.map(
    (loanId) => ({
      address: loanManager.address,
      abi: loanManager.abi,
      functionName: "getUserLoan",
      args: [loanId],
    }),
  );

  const userLoans = (await multicall(provider, {
    contracts: getUserLoans,
    allowFailure: false,
  })) as Array<AbiUserLoan>;

  const userLoansInfo: Record<LoanId, UserLoanInfo> = {};
  userLoans;
  poolsInfo;
  loanTypesInfo;
  oraclePrices;

  return userLoansInfo;
}
