import { CapTablePrivateTokenTransferVP } from "./../verifiablePresentations/CapTablePrivateTokenTransferVP";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import {
    TermsOfUseSymfoniVC,
    TermsOfUseForvaltVC,
} from "../verifiableCredentials/TermsOfUseVC";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";
import { CapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";

export type CapTablePrivateTokenTransferParams = {
    verifier: string;
    toShareholder: { name: string; amount: string };
    capTablePrivateTokenTransferVC?: CapTablePrivateTokenTransferVC;
    nationalIdentityVC?: NationalIdentityVC;
    termsOfUseSymfoniVC?: TermsOfUseSymfoniVC;
    termsOfUseForvaltVC?: TermsOfUseForvaltVC;
};

export type CapTablePrivateTokenTransferResult = {
    capTablePrivateTokenTransferVP: CapTablePrivateTokenTransferVP;
};

export type CreateCapTableVPParams = {
    verifier: string;
    capTable: CapTable;
    nationalIdentityVC?: NationalIdentityVC;
    capTableTermsOfUseVC?: TermsOfUseForvaltVC;
};

export type CreateCapTableVPResult = {
    createCapTableVP: CreateCapTableVP;
};

export type CapTable = {
    organizationNumber: string;
    shareholders: UnknowERC1400TokenTransfer[];
};

type UnknowERC1400TokenTransfer =
    | PrivateERC1400TokenTransfer
    | DirectERC1400TokenTransfer
    | BoardDirectorERC1400TokenTransfer;

interface ERC1400TokenTransfer {
    amount: string;
    partition: string;
    capTableAddress?: string;
}
interface PrivateERC1400TokenTransfer extends ERC1400TokenTransfer {
    identifier: string;
    isBoardDirector: boolean;
    email: string;
    name: string;
    postalcode: string;
    streetAddress: string;
}
interface BoardDirectorERC1400TokenTransfer extends ERC1400TokenTransfer {
    identifier?: never;
    isBoardDirector: true;
    email: string;
    name: string;
    postalcode: string;
    streetAddress: string;
}
interface DirectERC1400TokenTransfer extends ERC1400TokenTransfer {
    email?: never;
    identifier: string;
    name?: never;
    postalcode?: never;
    streetAddress?: never;
    isBoardDirector?: false;
}
