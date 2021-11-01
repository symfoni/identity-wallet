import { CapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { CapTableVC } from "../verifiableCredentials/CapTableVC";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { SupportedVerifiableCredential } from "../verifiableCredentials/SupportedVerifiableCredentials";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
} from "../verifiableCredentials/TermsOfUseVC";
import { CapTable } from "./capTableTypes";

export type BankIDParams = {};

export type VerifiablePresentationParams = {
    verifier: {
        id: string;
        name: string;
        reason: string;
    };
    verifiableCredentials: SupportedVerifiableCredential[];
};

export type AccessVPParams = {
    verifier: string;
    access: {
        delegatedTo: {
            id: string;
        };
        scopes: {
            id: string;
            name: string;
        }[];
    };
};

export type CapTablePrivateTokenTransferParams = {
    verifier: string;
    toShareholder: { name: string; amount: string };
    capTablePrivateTokenTransferVC?: CapTablePrivateTokenTransferVC;
    nationalIdentityVC?: NationalIdentityVC;
    termsOfUseSymfoniVC?: TermsOfUseSymfoniVC;
    termsOfUseForvaltVC?: TermsOfUseForvaltVC;
};

export type CreateCapTableVPParams = {
    verifier: string;
    capTable: CapTable;
    capTableVC?: CapTableVC;
    nationalIdentityVC?: NationalIdentityVC;
    termsOfUseSymfoniVC?: TermsOfUseSymfoniVC;
    termsOfUseForvaltVC?: TermsOfUseForvaltVC;
};
