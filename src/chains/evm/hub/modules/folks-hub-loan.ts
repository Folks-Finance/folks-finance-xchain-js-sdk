import * as dn from "dnum";
import { multicall } from "viem/actions";

import { UINT256_LENGTH } from "../../../../common/constants/bytes.js";
import { FINALITY } from "../../../../common/constants/message.js";
import { Action } from "../../../../common/types/message.js";
import { getRandomGenericAddress } from "../../../../common/utils/address.js";
import { convertNumberToBytes } from "../../../../common/utils/bytes.js";
import { getSpokeChain, getSpokeTokenData } from "../../../../common/utils/chain.js";
import {
  calcBorrowAssetLoanValue,
  calcBorrowBalance,
  calcBorrowInterestIndex,
  calcBorrowUtilisationRatio,
  calcCollateralAssetLoanValue,
  calcLiquidationMargin,
  calcLtvRatio,
  calcRewardIndex,
  toUnderlyingAmount,
} from "../../../../common/utils/formulae.js";
import { compoundEverySecond } from "../../../../common/utils/math-lib.js";
import { defaultEventParams } from "../../common/constants/contract.js";
import { getEvmSignerAccount } from "../../common/utils/chain.js";
import {
  buildEvmMessageData,
  buildMessageParams,
  buildMessagePayload,
  buildSendTokenExtraArgsWhenRemoving,
} from "../../common/utils/message.js";
import { getHubChain, getHubTokenData } from "../utils/chain.js";
import { getBridgeRouterHubContract, getHubContract, getLoanManagerContract } from "../utils/contract.js";
import { fetchUserLoanIds } from "../utils/events.js";

import type { EvmAddress } from "../../../../common/types/address.js";
import type { FolksChainId, NetworkType } from "../../../../common/types/chain.js";
import type { AccountId, LoanId } from "../../../../common/types/lending.js";
import type {
  MessageAdapters,
  MessageToSend,
  OptionalFeeParams,
  AdapterType,
  LiquidateMessageData,
  LiquidateMessageDataParams,
} from "../../../../common/types/message.js";
import type { LoanTypeId } from "../../../../common/types/module.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { PrepareLiquidateCall } from "../../common/types/module.js";
import type { LoanManagerAbi } from "../constants/abi/loan-manager-abi.js";
import type { HubChain } from "../types/chain.js";
import type {
  LoanManagerGetUserLoanType,
  LoanPoolInfo,
  LoanTypeInfo,
  UserLoanInfo,
  UserLoanInfoBorrow,
  UserLoanInfoCollateral,
} from "../types/loan.js";
import type { OraclePrices } from "../types/oracle.js";
import type { PoolInfo } from "../types/pool.js";
import type { HubTokenData } from "../types/token.js";
import type { Dnum } from "dnum";
import type {
  Client,
  ContractFunctionParameters,
  EstimateGasParameters,
  ReadContractReturnType,
  WalletClient,
} from "viem";

export const prepare = {
  async liquidate(
    provider: Client,
    sender: EvmAddress,
    data: LiquidateMessageData,
    accountId: AccountId,
    hubChain: HubChain,
    transactionOptions: EstimateGasParameters = {
      account: sender,
    },
  ): Promise<PrepareLiquidateCall> {
    const hub = getHubContract(provider, hubChain.hubAddress);

    const liquidateMessageDataParams: LiquidateMessageDataParams = {
      action: Action.Liquidate,
      data,
      extraArgs: "0x",
    };

    const messageData = buildEvmMessageData(liquidateMessageDataParams);

    const gasLimit = await hub.estimateGas.directOperation([Action.Liquidate, accountId, messageData], {
      ...transactionOptions,
      value: undefined,
    });

    return {
      gasLimit,
      hubAddress: hubChain.hubAddress,
      messageData,
    };
  },
};

export const write = {
  async liquidate(provider: Client, signer: WalletClient, accountId: AccountId, prepareCall: PrepareLiquidateCall) {
    const { gasLimit, messageData, hubAddress } = prepareCall;

    const hub = getHubContract(provider, hubAddress, signer);

    return await hub.write.directOperation([Action.Liquidate, accountId, messageData], {
      account: getEvmSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
    });
  },
};

export async function getSendTokenAdapterFees(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  folksTokenId: FolksTokenId,
  amount: bigint,
  receiverFolksChainId: FolksChainId,
  adapters: MessageAdapters,
  feeParams: OptionalFeeParams = {},
): Promise<bigint> {
  const hubChain = getHubChain(network);
  const hubTokenData = getHubTokenData(folksTokenId, network);
  const hubBridgeRouter = getBridgeRouterHubContract(provider, hubChain.bridgeRouterAddress);

  const spokeChain = getSpokeChain(receiverFolksChainId, network);
  const spokeTokenData = getSpokeTokenData(spokeChain, folksTokenId);

  // construct return message
  const returnParams = buildMessageParams({
    adapters: {
      adapterId: adapters.returnAdapterId,
      returnAdapterId: 0 as AdapterType,
    },
    gasLimit: feeParams.returnGasLimit,
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
    extraArgs: buildSendTokenExtraArgsWhenRemoving(spokeTokenData.spokeAddress, hubTokenData.token, amount),
  };

  // get return adapter fee
  return await hubBridgeRouter.read.getSendFee([returnMessage]);
}

export async function getLoanTypeInfo(
  provider: Client,
  network: NetworkType,
  loanTypeId: LoanTypeId,
  tokens: Array<HubTokenData>,
): Promise<LoanTypeInfo> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(provider, hubChain.loanManagerAddress);

  const getLoanPools: Array<ContractFunctionParameters> = tokens.map((token) => ({
    address: loanManager.address,
    abi: loanManager.abi,
    functionName: "getLoanPool",
    args: [loanTypeId, token.poolId],
  }));

  const [deprecated, loanTargetHealth, ...loanPools] = (await multicall(provider, {
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
  })) as [
    ReadContractReturnType<typeof LoanManagerAbi, "isLoanTypeDeprecated">,
    ReadContractReturnType<typeof LoanManagerAbi, "getLoanTypeLoanTargetHealth">,
    ...Array<ReadContractReturnType<typeof LoanManagerAbi, "getLoanPool">>,
  ];

  const pools: Partial<Record<FolksTokenId, LoanPoolInfo>> = {};
  for (const [
    i,
    {
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
    },
  ] of loanPools.entries()) {
    const token = tokens[i];

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
    deprecated,
    loanTargetHealth: [BigInt(loanTargetHealth), 4],
    pools,
  };
}

export async function getUserLoanIds(
  provider: Client,
  network: NetworkType,
  accountId: AccountId,
  loanTypeIdsFilter?: Array<LoanTypeId>,
): Promise<Map<LoanTypeId, Array<LoanId>>> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(provider, hubChain.loanManagerAddress);

  return fetchUserLoanIds({
    loanManager,
    accountId,
    loanTypeIds: loanTypeIdsFilter,
    eventParams: defaultEventParams,
  });
}

export async function getUserLoans(
  provider: Client,
  network: NetworkType,
  loanIds: Array<LoanId>,
): Promise<Map<LoanId, LoanManagerGetUserLoanType>> {
  const hubChain = getHubChain(network);
  const loanManager = getLoanManagerContract(provider, hubChain.loanManagerAddress);

  const getUserLoansCall: Array<ContractFunctionParameters> = loanIds.map((loanId) => ({
    address: loanManager.address,
    abi: loanManager.abi,
    functionName: "getUserLoan",
    args: [loanId],
  }));

  const userLoans: Array<LoanManagerGetUserLoanType> = (await multicall(provider, {
    contracts: getUserLoansCall,
    allowFailure: false,
  })) as Array<LoanManagerGetUserLoanType>;

  return new Map(loanIds.map((loanId, i) => [loanId, userLoans[i]]));
}

export function getUserLoansInfo(
  userLoansMap: Map<LoanId, LoanManagerGetUserLoanType>,
  poolsInfo: Partial<Record<FolksTokenId, PoolInfo>>,
  loanTypesInfo: Partial<Record<LoanTypeId, LoanTypeInfo>>,
  oraclePrices: OraclePrices,
): Record<LoanId, UserLoanInfo> {
  const poolIdToFolksTokenId = new Map(
    Object.values(poolsInfo).map(({ folksTokenId, poolId }) => [poolId, folksTokenId]),
  );

  const userLoansInfo: Record<LoanId, UserLoanInfo> = {};

  for (const [loanId, userLoan] of userLoansMap.entries()) {
    const [accountId, loanTypeId, colPools, borPools, cols, bors] = userLoan;

    const loanTypeInfo = loanTypesInfo[loanTypeId as LoanTypeId];
    if (!loanTypeInfo) throw new Error(`Unknown loan type id ${loanTypeId}`);

    // common to collaterals and borrows
    let netRate = dn.from(0, 18);
    let netYield = dn.from(0, 18);

    // collaterals
    const collaterals: Partial<Record<FolksTokenId, UserLoanInfoCollateral>> = {};
    let totalCollateralBalanceValue: Dnum = dn.from(0, 8);
    let totalEffectiveCollateralBalanceValue: Dnum = dn.from(0, 8);
    for (const [j, { balance: fTokenBalance }] of cols.entries()) {
      const poolId = colPools[j];

      const folksTokenId = poolIdToFolksTokenId.get(poolId);
      if (!folksTokenId) throw new Error(`Unknown pool id ${poolId}`);

      const poolInfo = poolsInfo[folksTokenId];
      const loanPoolInfo = loanTypeInfo.pools[folksTokenId];
      const tokenPrice = oraclePrices[folksTokenId];
      if (!poolInfo || !loanPoolInfo || !tokenPrice) throw new Error(`Unknown folks token id ${folksTokenId}`);

      const { tokenDecimals, depositData } = poolInfo;
      const { interestRate, interestIndex, interestYield } = depositData;
      const { collateralFactor } = loanPoolInfo;

      const tokenBalance = toUnderlyingAmount(fTokenBalance, interestIndex);
      const balanceValue = calcCollateralAssetLoanValue(tokenBalance, tokenPrice, tokenDecimals, dn.from(1, 4));
      const effectiveBalanceValue = calcCollateralAssetLoanValue(
        tokenBalance,
        tokenPrice,
        tokenDecimals,
        collateralFactor,
      );

      totalCollateralBalanceValue = dn.add(totalCollateralBalanceValue, balanceValue);
      totalEffectiveCollateralBalanceValue = dn.add(totalEffectiveCollateralBalanceValue, effectiveBalanceValue);
      netRate = dn.add(netRate, dn.mul(balanceValue, interestRate));
      netYield = dn.add(netYield, dn.mul(balanceValue, interestYield));

      collaterals[folksTokenId] = {
        folksTokenId,
        poolId,
        tokenDecimals,
        tokenPrice,
        collateralFactor,
        fTokenBalance,
        tokenBalance,
        balanceValue,
        effectiveBalanceValue,
        interestRate,
        interestYield,
      };
    }

    // borrows
    const borrows: Partial<Record<FolksTokenId, UserLoanInfoBorrow>> = {};
    let totalBorrowedAmountValue: Dnum = dn.from(0, 8);
    let totalBorrowBalanceValue: Dnum = dn.from(0, 8);
    let totalEffectiveBorrowBalanceValue: Dnum = dn.from(0, 8);
    for (const [
      j,
      {
        amount: borrowedAmount,
        balance: oldBorrowBalance,
        lastInterestIndex: lii,
        stableInterestRate: sbir,
        lastStableUpdateTimestamp,
      },
    ] of bors.entries()) {
      const poolId = borPools[j];

      const lastBorrowInterestIndex: Dnum = [lii, 18];
      const stableBorrowInterestRate: Dnum = [sbir, 18];

      const folksTokenId = poolIdToFolksTokenId.get(poolId);
      if (!folksTokenId) throw new Error(`Unknown pool id ${poolId}`);

      const poolInfo = poolsInfo[folksTokenId];
      const loanPoolInfo = loanTypeInfo.pools[folksTokenId];
      const tokenPrice = oraclePrices[folksTokenId];
      if (!poolInfo || !loanPoolInfo || !tokenPrice) throw new Error(`Unknown folks token id ${folksTokenId}`);

      const { tokenDecimals, variableBorrowData } = poolInfo;
      const { interestRate: variableBorrowInterestRate, interestIndex: variableBorrowInterestIndex } =
        variableBorrowData;
      const { borrowFactor } = loanPoolInfo;

      const isStable = lastStableUpdateTimestamp > 0n;
      const bororwInterestIndex = isStable
        ? calcBorrowInterestIndex(stableBorrowInterestRate, lastBorrowInterestIndex, lastStableUpdateTimestamp)
        : variableBorrowInterestIndex;
      const borrowedAmountValue = calcBorrowAssetLoanValue(borrowedAmount, tokenPrice, tokenDecimals, dn.from(1, 4));
      const borrowBalance = calcBorrowBalance(oldBorrowBalance, bororwInterestIndex, lastBorrowInterestIndex);
      const borrowBalanceValue = calcBorrowAssetLoanValue(borrowBalance, tokenPrice, tokenDecimals, dn.from(1, 4));
      const effectiveBorrowBalanceValue = calcBorrowAssetLoanValue(
        borrowBalance,
        tokenPrice,
        tokenDecimals,
        borrowFactor,
      );
      const accruedInterest = borrowBalance - borrowedAmount;
      const accruedInterestValue = dn.sub(borrowBalanceValue, borrowedAmountValue);
      const interestRate = isStable ? stableBorrowInterestRate : variableBorrowInterestRate;
      const interestYield = compoundEverySecond(interestRate);

      totalBorrowedAmountValue = dn.add(totalBorrowedAmountValue, borrowedAmountValue);
      totalBorrowBalanceValue = dn.add(totalBorrowBalanceValue, borrowBalanceValue);
      totalEffectiveBorrowBalanceValue = dn.add(totalEffectiveBorrowBalanceValue, effectiveBorrowBalanceValue);
      netRate = dn.sub(netRate, dn.mul(borrowBalanceValue, interestRate));
      netYield = dn.sub(netYield, dn.mul(borrowBalanceValue, interestYield));

      borrows[folksTokenId] = {
        folksTokenId,
        poolId,
        tokenDecimals,
        tokenPrice,
        isStable,
        borrowFactor,
        borrowedAmount,
        borrowedAmountValue,
        borrowBalance,
        borrowBalanceValue,
        effectiveBorrowBalanceValue,
        accruedInterest,
        accruedInterestValue,
        interestRate,
        interestYield,
      };
    }

    if (dn.greaterThan(totalCollateralBalanceValue, 0)) {
      netRate = dn.div(netRate, totalCollateralBalanceValue);
      netYield = dn.div(netRate, totalCollateralBalanceValue);
    }

    const loanToValueRatio = calcLtvRatio(totalBorrowBalanceValue, totalCollateralBalanceValue);
    const borrowUtilisationRatio = calcBorrowUtilisationRatio(
      totalEffectiveBorrowBalanceValue,
      totalEffectiveCollateralBalanceValue,
    );
    const liquidationMargin = calcLiquidationMargin(
      totalEffectiveBorrowBalanceValue,
      totalEffectiveCollateralBalanceValue,
    );

    userLoansInfo[loanId] = {
      loanId,
      loanTypeId,
      accountId: accountId as AccountId,
      collaterals,
      borrows,
      netRate,
      netYield,
      totalCollateralBalanceValue,
      totalBorrowedAmountValue,
      totalBorrowBalanceValue,
      totalEffectiveCollateralBalanceValue,
      totalEffectiveBorrowBalanceValue,
      loanToValueRatio,
      borrowUtilisationRatio,
      liquidationMargin,
    };
  }

  return userLoansInfo;
}
