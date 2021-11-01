export function makeTermsOfUseForvaltVC(): TermsOfUseForvaltVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseForvaltVC"],
        credentialSubject: {
            readAndAccepted: {
                id: "https://forvalt.no/TOA",
            },
        },
    };
}

export function makeTermsOfUseSymfoniVC(): TermsOfUseSymfoniVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseSymfoniVC"],
        credentialSubject: {
            readAndAccepted: {
                id: "https://symfoni.id/TOA",
            },
        },
    };
}

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
    credentialSubject: {
        readAndAccepted: {
            id: string;
        };
        // Signature
        id?: string;
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
