import { PrivateERC1400TokenTransfer } from "./../types/requestTypes";

export function makeCapTablePrivateTokenTransferVC(toShareholder: {
    name: string;
    amount: string;
}): CapTablePrivateTokenTransferVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "CapTablePrivateTokenTransferVC"],
        credentialSubject: {
            toShareholder,
        },
    };
}
export type CapTablePrivateTokenTransferVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTablePrivateTokenTransferVC"];
    credentialSubject: {
        toShareholder: { name: string; amount: string };
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
        type: string;
        jwt: string;
    };
};
