import { PrivateERC1400TokenTransfer } from "./../types/requestTypes";

export type CapTablePrivateTokenTransferVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTablePrivateTokenTransferVC"];
    credentialSubject: {
        toShareholder: PrivateERC1400TokenTransfer;
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
