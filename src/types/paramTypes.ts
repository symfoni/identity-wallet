export type ParamBankIDToken = {
    id: number;
    method: "PARAM_BANKID_TOKEN";
    params: {
        bankIDToken: string;
    };
};

export type ParamPresentCredentialDemo = {
    type: "PARAM_PRESENT_CREDENTIAL_DEMO";
    demoBankIDPersonnummer: string;
    demoEmail: string;
};
