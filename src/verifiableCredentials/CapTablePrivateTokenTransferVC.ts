import { PrivateERC1400TokenTransfer } from "./../types/requestTypes";
import { VerifiableCredential } from "@veramo/core";

// @see https://www.notion.so/symfoni/CapTableVC-e7cd19ae4eb845979db304d57f77ba19
export type CapTablePrivateTokenTransferVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTablePrivateTokenTransferVC"];
    issuer: string;
    credentialSubject: {
        id: string;
        toShareholder: PrivateERC1400TokenTransfer;
    };
    issuanceDate: string;
    expirationDate: string;
};
