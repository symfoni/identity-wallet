import { VerifiablePresentationParams } from "./paramTypes";
import { ScreenRequest } from "./ScreenRequest";
import { BankIDScreenResult, ScreenResult } from "./ScreenResults";

export type VerifiablePresentationScreenParams =
    | ScreenRequest<VerifiablePresentationParams>
    | BankIDScreenResult;
