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

/**
 * @param fromScreen Screen we want to navigate back to
 * @param fromNavigator Navigator we want to navigate back to
 * @param method JsonRPC method
 * @param params
 * @param id Optional id for the JsonRPC request
 * @returns
 */
export function makeVerifiablePresentationScreenRequest({
    fromScreen,
    method,
    params,
    fromNavigator,
    id,
}: {
    fromScreen: string;
    method: string;
    params: VerifiablePresentationParams;
    fromNavigator?: string;
    id?: number;
}) {
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
