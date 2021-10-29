// @see https://www.notion.so/symfoni/NationalIdentityVC-f0ad0a6b75a64cca9d887f0243dc41ae
export type NationalIdentityVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "NationalIdentityVC"];

    credentialSubject?: {
        nationalIdentityNumber: string;
    };
    // Signature
    issuer?: {
        id: string;
    };
    issuanceDate?: string;
    expirationDate?: string;
    evidence?: { type: string; jwt: string }[];
    proof?: {
        type: string;
        jwt: string;
    };
};
