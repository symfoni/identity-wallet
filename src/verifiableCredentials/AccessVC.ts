export function makeAccessVC(access: {
    delegatedTo: {
        id: string;
    };
    scopes: {
        id: string;
        name: string;
    }[];
}): AccessVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "AccessVC"],
        credentialSubject: {
            access: { ...access },
        },
    };
}

export type AccessVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "AccessVC"];
    credentialSubject: {
        access: {
            delegatedTo: {
                id: string;
            };
            scopes: {
                id: string;
                name: string;
            }[];
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
