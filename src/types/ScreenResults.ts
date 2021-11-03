import {
    JsonRpcError,
    JsonRpcRequest,
    JsonRpcResult,
} from "@json-rpc-tools/types";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { BankIDParams, VerifiablePresentationParams } from "./paramTypes";
import { BankIDResult, VerifiablePresentationResult } from "./resultTypes";

export function makeBankIDScreenResult(
    request: JsonRpcRequest<BankIDParams>,
    result: BankIDResult
) {
    return {
        result: formatJsonRpcResult(request.id, result),
    } as ScreenResult<BankIDResult>;
}

export function makeVerifiablePresentationScreenResult(
    request: JsonRpcRequest<VerifiablePresentationParams>,
    result: VerifiablePresentationResult
) {
    return {
        result: formatJsonRpcResult(request.id, result),
    } as ScreenResult<VerifiablePresentationResult>;
}

export function makeScreenError(
    request: JsonRpcRequest<any>,
    error: { code: number; message: string }
) {
    return {
        error: formatJsonRpcError(request.id, error),
    } as ScreenError;
}

export type ScreenResult<Result> = {
    fromScreen: never;
    fromNavigator: never;
    request: never;
    result: JsonRpcResult<Result>;
    error: never;
};

export type ScreenError = {
    fromScreen: never;
    fromNavigator: never;
    request: never;
    result: never;
    error: JsonRpcError;
};
