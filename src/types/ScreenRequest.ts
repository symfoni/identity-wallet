import { JsonRpcRequest } from "@json-rpc-tools/types";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import {
    BankIDParams,
    CapTablePrivateTokenTransferParams,
    CreateCapTableVPParams,
    VerifiablePresentationParams,
} from "./paramTypes";

export function makeBankIDScreenRequest(
    fromScreen: string,
    fromNavigator: string | undefined,
    method: string,
    params: BankIDParams
) {
    const request = formatJsonRpcRequest(method, params);

    return {
        fromScreen,
        fromNavigator,
        request,
    } as ScreenRequest<BankIDParams>;
}

export function makeVerifiablePresentationScreenRequest(
    fromScreen: string,
    fromNavigator: string | undefined,
    method: string,
    params: VerifiablePresentationParams,
    id?: number
) {
    const request = formatJsonRpcRequest(method, params, id);

    return {
        fromScreen,
        fromNavigator,
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
    fromNavigator: string;
    result: never; // @see ScreenResult<T>
    error: never; // @see ScreenError
};
