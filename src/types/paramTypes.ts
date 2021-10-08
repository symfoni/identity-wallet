export interface ParamBankIDToken {
    type: "PARAM_BANKID_TOKEN";
    bankIDToken: string;
}

export interface ParamPresentCredentialDemo {
    type: "PARAM_PRESENT_CREDENTIAL_DEMO";
    demoBankIDPersonnummer: string;
    demoEmail: string;
}
