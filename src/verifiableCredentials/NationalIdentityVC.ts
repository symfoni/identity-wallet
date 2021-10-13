import { VerifiableCredential } from "@veramo/core";

export type NationalIdentityVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    credentialSubject: {
        nationalIdentityNumber: {
            id: string;
        };
    };
};
