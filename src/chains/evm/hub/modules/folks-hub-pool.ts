import { multicall } from "viem/actions";

import {
  calcBorrowInterestIndex,
  calcDepositInterestIndex,
  calcOverallBorrowInterestRate,
  calcRetention,
} from "../../../../common/utils/formulae.js";
import { compoundEveryHour, compoundEverySecond } from "../../../../common/utils/math-lib.js";
import { getHubTokenData } from "../utils/chain.js";
import { getHubPoolContract } from "../utils/contract.js";

import type { EvmAddress, GenericAddress } from "../../../../common/types/address.js";
import type { NetworkType } from "../../../../common/types/chain.js";
import type { FolksTokenId } from "../../../../common/types/token.js";
import type { PoolInfo } from "../types/pool.js";
import type { Client } from "viem";

export async function getPoolInfo(
  provider: Client,
  network: NetworkType,
  folksTokenId: FolksTokenId,
): Promise<PoolInfo> {
  const {
    poolAddress,
    token: { decimals: tokenDecimals },
  } = getHubTokenData(folksTokenId, network);
  const hubPool = getHubPoolContract(provider, poolAddress);

  // get pool data
  const [
    poolId,
    lastUpdateTimestamp,
    feeData,
    depositData,
    variableBorrowData,
    stableBorrowData,
    capsData,
    configData,
    fTokenCirculatingSupply,
  ] = await multicall(provider, {
    contracts: [
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getPoolId",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getLastUpdateTimestamp",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getFeeData",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getDepositData",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getVariableBorrowData",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getStableBorrowData",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getCapsData",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "getConfigData",
      },
      {
        address: hubPool.address,
        abi: hubPool.abi,
        functionName: "totalSupply",
      },
    ],
    allowFailure: false,
  });

  const {
    flashLoanFee,
    retentionRate,
    fTokenFeeRecipient,
    tokenFeeClaimer,
    totalRetainedAmount: actualRetained,
    tokenFeeRecipient,
  } = feeData;
  const {
    optimalUtilisationRatio,
    totalAmount: depositTotalAmount,
    interestRate: depositInterestRate,
    interestIndex: oldDepositInterestIndex,
  } = depositData;
  const {
    vr0,
    vr1,
    vr2,
    totalAmount: variableBorrowTotalAmount,
    interestRate: variableBorrowInterestRate,
    interestIndex: oldVariableBorrowInterestsIndex,
  } = variableBorrowData;
  const {
    sr0,
    sr1,
    sr2,
    sr3,
    optimalStableToTotalDebtRatio,
    rebalanceUpUtilisationRatio,
    rebalanceUpDepositInterestRate,
    rebalanceDownDelta,
    totalAmount: stableBorrowTotalAmount,
    interestRate: stableBorrowInterestRate,
    averageInterestRate: stableBorrowAverageInterestRate,
  } = stableBorrowData;
  const { deposit: depositCap, borrow: borrowCap, stableBorrowPercentage: stableBorrowPercentageCap } = capsData;
  const { deprecated, stableBorrowSupported, canMintFToken, flashLoanSupported } = configData;

  // build pool info
  return {
    folksTokenId,
    poolId,
    tokenDecimals,
    feeData: {
      flashLoanFee: [BigInt(flashLoanFee), 6],
      retentionRate: [BigInt(retentionRate), 6],
      totalRetainedAmount: calcRetention(
        actualRetained,
        variableBorrowTotalAmount + stableBorrowTotalAmount,
        calcOverallBorrowInterestRate(
          variableBorrowTotalAmount,
          stableBorrowTotalAmount,
          [variableBorrowInterestRate, 18],
          [stableBorrowAverageInterestRate, 18],
        ),
        [BigInt(retentionRate), 6],
        lastUpdateTimestamp,
      ),
      fTokenFeeRecipient: fTokenFeeRecipient as EvmAddress,
      tokenFeeClaimer: tokenFeeClaimer as EvmAddress,
      tokenFeeRecipient: tokenFeeRecipient as GenericAddress,
    },
    depositData: {
      optimalUtilisationRatio: [BigInt(optimalUtilisationRatio), 4],
      totalAmount: depositTotalAmount,
      interestRate: [depositInterestRate, 18],
      interestYield: compoundEveryHour([depositInterestRate, 18]),
      interestIndex: calcDepositInterestIndex(
        [depositInterestRate, 18],
        [oldDepositInterestIndex, 18],
        lastUpdateTimestamp,
      ),
    },
    variableBorrowData: {
      vr0: [BigInt(vr0), 6],
      vr1: [BigInt(vr1), 6],
      vr2: [BigInt(vr2), 6],
      totalAmount: variableBorrowTotalAmount,
      interestRate: [variableBorrowInterestRate, 18],
      interestYield: compoundEverySecond([variableBorrowInterestRate, 18]),
      interestIndex: calcBorrowInterestIndex(
        [variableBorrowInterestRate, 18],
        [oldVariableBorrowInterestsIndex, 18],
        lastUpdateTimestamp,
      ),
    },
    stableBorrowData: {
      sr0: [BigInt(sr0), 6],
      sr1: [BigInt(sr1), 6],
      sr2: [BigInt(sr2), 6],
      sr3: [BigInt(sr3), 6],
      optimalStableToTotalDebtRatio: [BigInt(optimalStableToTotalDebtRatio), 4],
      rebalanceUpUtilisationRatio: [BigInt(rebalanceUpUtilisationRatio), 4],
      rebalanceUpDepositInterestRate: [BigInt(rebalanceUpDepositInterestRate), 4],
      rebalanceDownDelta: [BigInt(rebalanceDownDelta), 4],
      totalAmount: stableBorrowTotalAmount,
      interestRate: [stableBorrowInterestRate, 18],
      interestYield: compoundEverySecond([stableBorrowInterestRate, 18]),
      averageInterestRate: [stableBorrowAverageInterestRate, 18],
      averageInterestYield: compoundEverySecond([stableBorrowAverageInterestRate, 18]),
    },
    capsData: {
      deposit: BigInt(depositCap),
      borrow: BigInt(borrowCap),
      stableBorrowPercentage: [BigInt(stableBorrowPercentageCap), 18],
    },
    configData: {
      deprecated,
      stableBorrowSupported,
      canMintFToken,
      flashLoanSupported,
    },
    fTokenCirculatingSupply,
  };
}
