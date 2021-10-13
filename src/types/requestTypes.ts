import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export type CreateCapTableVPRequest = {
    type: "CREATE_CAP_TABLE_VP_REQUEST";
    params: {
        nationalIdentityVC?: NationalIdentityVC;
        capTableTermsOfUseVC?: TermsOfUseVC;
    };
};

export type CreateCapTableVPResponse = {
    type: "CREATE_CAP_TABLE_VP_RESPONSE";
    payload: {
        createCapTableVP: CreateCapTableVP;
    };
};
