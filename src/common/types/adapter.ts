import type { FolksChainId, NetworkType } from "./chain.js";
import type { DataAction, ReceiveTokenAction, SendTokenAction } from "./message.js";
import type { FolksTokenId } from "./token.js";

export enum MessageAdapterParamsType {
  SendToken,
  ReceiveToken,
  Data,
}

export type SendTokenMessageAdapterParams = {
  messageAdapterParamType: MessageAdapterParamsType.SendToken;
  action: SendTokenAction;
  network: NetworkType;
  sourceFolksChainId: FolksChainId;
  folksTokenId: FolksTokenId;
};

export type ReceiveTokenMessageAdapterParams = {
  messageAdapterParamType: MessageAdapterParamsType.ReceiveToken;
  action: ReceiveTokenAction;
  network: NetworkType;
  sourceFolksChainId: FolksChainId;
  destFolksChainId: FolksChainId;
  folksTokenId: FolksTokenId;
};

export type DataMessageAdapterParams = {
  messageAdapterParamType: MessageAdapterParamsType.Data;
  action: DataAction;
  network: NetworkType;
  sourceFolksChainId: FolksChainId;
};

export type MessageAdapterParams =
  | SendTokenMessageAdapterParams
  | ReceiveTokenMessageAdapterParams
  | DataMessageAdapterParams;
