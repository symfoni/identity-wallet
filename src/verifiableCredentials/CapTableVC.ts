import { VerifiableCredential } from "@veramo/core";
import { CapTable } from "../types/capTableTypes";

// @see https://www.notion.so/symfoni/CapTableVC-e7cd19ae4eb845979db304d57f77ba19
export type CapTableVC = VerifiableCredential & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTableVC"];
    issuer: string;
    credentialSubject: {
        capTable: CapTable;
    };
    issuanceDate: string;
    expirationDate: string;
};
