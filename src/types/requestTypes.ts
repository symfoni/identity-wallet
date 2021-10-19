import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export type CreateCapTableVPRequest = {
    type: "CREATE_CAP_TABLE_VP_REQUEST";
    params: {
        nationalIdentityVC?: NationalIdentityVC;
        capTableTermsOfUseVC?: TermsOfUseVC;
        capTableForm: CapTableForm;
    };
};

export type CreateCapTableVPResponse = {
    type: "CREATE_CAP_TABLE_VP_RESPONSE";
    payload: {
        createCapTableVP: CreateCapTableVP;
    };
};

export type CreateCapTableVPError = {
    type: "CREATE_CAP_TABLE_VP_ERROR";
    error: {
        message: string;
        details: any;
    };
};

export type CapTableForm = {
    organizationNumber: string;
    shareholders: UnknowERC1400TokenTransfer[];
};

export type UnknowERC1400TokenTransfer =
    | PrivateERC1400TokenTransfer
    | DirectERC1400TokenTransfer
    | BoardDirectorERC1400TokenTransfer;

export interface ERC1400TokenTransfer {
    amount: string;
    partition: string;
    capTableAddress?: string;
}
export interface PrivateERC1400TokenTransfer extends ERC1400TokenTransfer {
    identifier: string;
    isBoardDirector: boolean;
    email: string;
    name: string;
    postalcode: string;
    streetAddress: string;
}
export interface BoardDirectorERC1400TokenTransfer
    extends ERC1400TokenTransfer {
    identifier?: never;
    isBoardDirector: true;
    email: string;
    name: string;
    postalcode: string;
    streetAddress: string;
}
export interface DirectERC1400TokenTransfer extends ERC1400TokenTransfer {
    email?: never;
    identifier: string;
    name?: never;
    postalcode?: never;
    streetAddress?: never;
    isBoardDirector?: false;
}
