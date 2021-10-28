import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { formatJsonRpcResult } from "@json-rpc-tools/utils";
import { BankIDParam } from "./paramTypes";
import { BankIDResult } from "./resultTypes";

export function makeBankIDScreenResult(
    request: JsonRpcRequest<BankIDParam>,
    result: BankIDResult
) {
    return {
        result: formatJsonRpcResult(request.id, result),
    } as BankIDScreenResult;
}

export type BankIDScreenResult = ScreenResult<BankIDResult>;

export type ScreenResult<Result> = {
    fromScreen: never;
    request: never;
    result: JsonRpcResult<Result>;
};
