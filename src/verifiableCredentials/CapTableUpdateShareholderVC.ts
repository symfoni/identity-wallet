import { UpdateShareholderData } from "../types/requestTypes";

export function makeUpdateShareholderVC(
    shareholderId: string,
    capTableAddress: string,
    shareholderData: UpdateShareholderData
): CapTableUpdateShareholderVC {
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.symfoni.id/credentials/v1",
        ],
        type: ["VerifiableCredential", "CapTableUpdateShareholderVC"],
        credentialSubject: {
            shareholderId,
            capTableAddress,
            shareholderData,
        },
    };
}

export type CapTableUpdateShareholderVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1"
    ];
    type: ["VerifiableCredential", "CapTableUpdateShareholderVC"];
    credentialSubject: {
        shareholderId: string;
        capTableAddress: string;
        shareholderData: UpdateShareholderData;
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
