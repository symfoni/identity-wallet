export function makeCapTableClaimTokenVC(
    claimTokens: string[] | string
): CapTableClaimTokenVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "CapTableClaimTokenVC"],
        credentialSubject: {
            claimTokens: [...claimTokens],
        },
    };
}
// @see https://www.notion.so/symfoni/CapTableVC-e7cd19ae4eb845979db304d57f77ba19
export type CapTableClaimTokenVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTableClaimTokenVC"];
    credentialSubject: {
        claimTokens: string[];

        // The rest is set by Veramo when signing the VC
        id?: string;
    };
    // Signature
    issuer?: {
        id: string;
    };
    issuanceDate?: string;
    expirationDate?: string;
    proof?: {
        type: string;
        jwt: string;
    };
};
