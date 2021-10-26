import { VerifiableCredential } from "@veramo/core";

export type TermsOfUseVC = TermsOfUseForvaltVC | TermsOfUseSymfoniVC;
export type TermsOfUseForvaltVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiableCredential", "TermsOfUseForvaltVC"];
    issuer: string;
    credentialSubject: {
        id: string;
        readAndAccepted: {
            id: string;
        };
    };
    issuanceDate: string;
    expirationDate: string;
};

export type TermsOfUseSymfoniVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiableCredential", "TermsOfUseSymfoniVC"];
    issuer: string;
    credentialSubject: {
        id: string;
        readAndAccepted: {
            id: string;
        };
    };
    issuanceDate: string;
    expirationDate: string;
};
