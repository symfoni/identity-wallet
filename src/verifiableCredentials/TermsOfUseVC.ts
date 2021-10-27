export type TermsOfUseVC = TermsOfUseForvaltVC | TermsOfUseSymfoniVC;
export type TermsOfUseForvaltVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "TermsOfUseForvaltVC"];
    credentialSubject: {
        id: string;
        readAndAccepted: {
            id: string;
        };
    };
    issuer: {
        id: string;
    };
    issuanceDate: string;
    expirationDate: string;
    proof: {
        type?: string;
        jwt: string;
    };
};

export type TermsOfUseSymfoniVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "TermsOfUseSymfoniVC"];
    credentialSubject: {
        id: string;
        readAndAccepted: {
            id: string;
        };
    };
    // Signature
    issuer: {
        id: string;
    };
    issuanceDate: string;
    expirationDate: string;
    proof: {
        type?: string;
        jwt: string;
    };
};
