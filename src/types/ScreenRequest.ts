import { JsonRpcRequest } from "@json-rpc-tools/types";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

export function makeBankIDScreenRequest(fromScreen: string) {
    return {
        fromScreen,
        request: formatJsonRpcRequest("SymfoniID_requestBankID", {}),
    } as BankIDScreenRequest;
}

export type BankIDScreenRequest = ScreenRequest<{}>;

export type ScreenRequest<Params> = {
    fromScreen: string;
    request: JsonRpcRequest<Params>;
    result: never;
};
