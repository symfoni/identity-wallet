import { CreateCapTableVP } from "./CreateCapTableVP";
import { VerifiablePresentation } from "@veramo/core";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";
import { CapTableClaimTokenVC } from "../verifiableCredentials/CapTableClaimTokenVC";

// @see https://www.notion.so/symfoni/CreateCapTableVP-f966519ff2734b2fbca45bd87cf414b1
export type CapTableClaimTokenVP = VerifiablePresentation & {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.dev/credentials/v1"
    ];
    type: ["VerifiablePresentation", "CapTableClaimTokenVP"];
    verifiableCredential:
        | CapTableClaimTokenVC
        | TermsOfUseVC
        | NationalIdentityVC[];
    holder: string;
    issuanceDate: string;
};
