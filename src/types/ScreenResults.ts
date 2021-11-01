import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { formatJsonRpcResult } from "@json-rpc-tools/utils";
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

export type ScreenResult<Result> = {
    fromScreen: never;
    fromNavigator: never;
    request: never;
    result: JsonRpcResult<Result>;
};
