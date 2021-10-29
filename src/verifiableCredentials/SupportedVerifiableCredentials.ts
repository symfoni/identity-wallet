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
    | TermsOfUseSymfoniVC;
