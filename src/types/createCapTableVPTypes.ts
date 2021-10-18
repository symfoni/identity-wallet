import {
    ErrorResponse,
    JsonRpcError,
    JsonRpcRequest,
    JsonRpcResponse,
    JsonRpcResult,
} from "@json-rpc-tools/types";
import {
    formatJsonRpcError,
    formatJsonRpcRequest,
    formatJsonRpcResult,
} from "@json-rpc-tools/utils";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export function formatCreateCapTableVPRequest(
    params: CreateCapTableVPParams
): CreateCapTableVPRequest {
    return formatJsonRpcRequest("symfoniID_createCapTableVPRequest", params);
}

export function formatCreateCapTableVPResult(
    request: CreateCapTableVPRequest,
    result: CreateCapTableVPResult
): CreateCapTableVPResponse {
    return formatJsonRpcResult(request.id, result);
}

export function formatCreateCapTableVPError(
    request: CreateCapTableVPRequest,
    error: string | ErrorResponse
): CreateCapTableVPError {
    return formatJsonRpcError(request.id, error);
}

export type CreateCapTableVPRequest = JsonRpcRequest<CreateCapTableVPParams>;
export type CreateCapTableVPResponse = JsonRpcResponse<CreateCapTableVPResult>;
export type CreateCapTableVPError = JsonRpcError;

type CreateCapTableVPParams = {
    verifier: string;
    capTableForm: CapTableForm;
    nationalIdentityVC?: NationalIdentityVC;
    capTableTermsOfUseVC?: TermsOfUseVC;
};

type CreateCapTableVPResult = {
    createCapTableVP: CreateCapTableVP;
};

type CapTableForm = {
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
