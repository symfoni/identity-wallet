export type TermsOfUseForvaltVC = BaseTermsOfUseVC & {
    type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseForvaltVC"];
};

export type TermsOfUseSymfoniVC = BaseTermsOfUseVC & {
    type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseSymfoniVC"];
};

export type TermsOfUseVC = BaseTermsOfUseVC & {
    type: ["VerifiableCredential", "TermsOfUseVC"];
};

type BaseTermsOfUseVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];

    credentialSubject?: {
        id?: string;
        readAndAccepted?: {
            id: string;
        };
    };
    // Signature
    issuer?: {
        id: string;
    };
    issuanceDate?: string;
    expirationDate?: string;
    proof?: {
        type?: string;
        jwt: string;
    };
};
