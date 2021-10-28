import { SupportedVerifiableCredential } from "../verifiableCredentials/SupportedVerifiableCredentials";

export type ParamPresentCredentialDemo = {
    type: "PARAM_PRESENT_CREDENTIAL_DEMO";
    demoBankIDPersonnummer: string;
    demoEmail: string;
};

export type VerifiablePresentationParams = {
    verifier: {
        id: string;
        name: string;
        reason: string;
    };
    verifiableCredentials: SupportedVerifiableCredential[];
};
