import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export type ParamBankIDToken = {
    type: "PARAM_BANKID_TOKEN";
    bankIDToken: string;
};

export type ParamPresentCredentialDemo = {
    type: "PARAM_PRESENT_CREDENTIAL_DEMO";
    demoBankIDPersonnummer: string;
    demoEmail: string;
};

export type ParamCreateCapTableVP = {
    type: "PARAM_CREATE_CAP_TABLE_VP";
    createCapTableVP: CreateCapTableVP;
};
