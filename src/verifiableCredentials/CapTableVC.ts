import { CapTable } from "../types/capTableTypes";

export function makeCapTableVC(capTable: CapTable): CapTableVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "CapTableVC"],
        credentialSubject: {
            capTable,
        },
    };
}
// @see https://www.notion.so/symfoni/CapTableVC-e7cd19ae4eb845979db304d57f77ba19
export type CapTableVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTableVC"];
    credentialSubject: {
        capTable: CapTable;

        // Set by Veramo
        id?: string;
    };
    // Set by Veramo
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
