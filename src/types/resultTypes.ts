import { VerifiablePresentation } from "@veramo/core";

export type VerifiablePresentationResult = {
    vp?: VerifiablePresentation; // Dont send both vp and jwt in production.
    jwt: string;
};

export type BankIDResult = {
    bankIDToken: string;
};
