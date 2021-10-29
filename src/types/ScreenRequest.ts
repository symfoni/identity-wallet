import { JsonRpcRequest } from "@json-rpc-tools/types";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import {
    CapTablePrivateTokenTransferParams,
    CreateCapTableVPParams,
} from "./capTableTypes";
import { BankIDParams, VerifiablePresentationParams } from "./paramTypes";

export function makeBankIDScreenRequest(
    fromScreen: string,
    method: string,
    params: BankIDParams
) {
    const request = formatJsonRpcRequest(method, params);

    return {
        fromScreen,
        request,
    } as ScreenRequest<BankIDParams>;
}

export function makeVerifiablePresentationScreenRequest(
    fromScreen: string,
    method: string,
    params: VerifiablePresentationParams
) {
    const request = formatJsonRpcRequest(method, params);

    return {
        fromScreen,
        request,
    } as ScreenRequest<VerifiablePresentationParams>;
}

export function makeCreateCapTableVPScreenRequest(
    fromScreen: string,
    method: string,
    params: CreateCapTableVPParams
) {
    const request = formatJsonRpcRequest(method, params);

    return {
        fromScreen,
        request,
    } as ScreenRequest<CreateCapTableVPParams>;
}

export function makeCapTablePrivateTokenTransferScreenRequest(
    fromScreen: string,
    method: string,
    params: CapTablePrivateTokenTransferParams
) {
    const request = formatJsonRpcRequest(method, params);

    return {
        fromScreen,
        request,
    } as ScreenRequest<CapTablePrivateTokenTransferParams>;
}

export type ScreenRequest<Params> = {
    request: JsonRpcRequest<Params>;
    fromScreen: string;
    result: never;
};
