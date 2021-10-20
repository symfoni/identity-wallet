import { VerifiableCredential } from "@veramo/core";

// @see https://www.notion.so/symfoni/TermsOfUseVC-1b826837f289481097476d1fca6b35a1
export type TermsOfUseVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiableCredential", "TermsOfUseVC"];
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
