import { CapTablePrivateTokenTransferVC } from "./CapTablePrivateTokenTransferVC";
import { CapTableVC } from "./CapTableVC";
import { NationalIdentityVC } from "./NationalIdentityVC";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
    TermsOfUseVC,
} from "./TermsOfUseVC";

export type SupportedVerifiableCredential =
    | NationalIdentityVC
    | TermsOfUseVC
    | TermsOfUseForvaltVC
    | TermsOfUseSymfoniVC
    | CapTablePrivateTokenTransferVC
    | CapTableVC;
