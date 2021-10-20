import {
    formatJsonRpcRequest,
    formatJsonRpcResult,
    JsonRpcRequest,
} from "@json-rpc-tools/utils";

export function makeBankIDRequest(params: BankIDParam) {
    return formatJsonRpcRequest("SymfoniID_requestBankID", params);
}

export function makeBankIDResult(
    request: JsonRpcRequest<BankIDParam>,
    result: BankIDResult
) {
    return formatJsonRpcResult(request.id, result);
}

export type BankIDParam = {
    resultScreen: string;
};

export type BankIDResult = {
    bankIDToken: string;
};

export type ParamPresentCredentialDemo = {
    type: "PARAM_PRESENT_CREDENTIAL_DEMO";
    demoBankIDPersonnummer: string;
    demoEmail: string;
};
