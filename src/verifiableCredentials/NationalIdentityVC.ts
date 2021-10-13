import { VerifiableCredential } from "@veramo/core";

// @see https://www.notion.so/symfoni/NationalIdentityVC-f0ad0a6b75a64cca9d887f0243dc41ae
export type NationalIdentityVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiableCredential", "NationalIdentityVC"];
    issuer: string;
    credentialSubject: {
        nationalIdentityNumber: string;
    };
    issuanceDate: string;
    expirationDate: string;
};
