import { formatJsonRpcRequest, JsonRpcRequest } from "@json-rpc-tools/utils";
import React from "react";
import { Button } from "react-native";
import { useSymfoniContext } from "../context";
import {
    SCREEN_CREATE_CAP_TABLE_VP,
    SCREEN_DEMO,
    SCREEN_BANKID,
    SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP,
    SCREEN_VERIFIABLE_PRESENTATION,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import {
    CapTablePrivateTokenTransferParams,
    CreateCapTableVPParams,
} from "../types/capTableTypes";
import { makeBankIDRequest } from "../types/paramTypes";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
} from "../verifiableCredentials/TermsOfUseVC";
import { VerifiablePresentationParams } from "../verifiablePresentations/VerifiablePresentationScreen";

export function DemoScreen() {
    const { findVCByType } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult();

    return (
        <>
            <Button
                title="Demo: Vis Legitimasjon"
                onPress={async () => {
                    const request = demoVerifiablePresentationScreenRequest();

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        SCREEN_DEMO,
                        request
                    );

                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Opprett aksjeeierbok"
                onPress={async () => {
                    const request =
                        formatJsonRpcRequest<CreateCapTableVPParams>(
                            "symfoniID_createCapTableVP",
                            {
                                verifier: "demo",
                                capTable: {
                                    organizationNumber: "demo",
                                    shareholders: [],
                                },
                            }
                        );
                    console.info({ request });

                    const result = await navigateWithResult(
                        SCREEN_CREATE_CAP_TABLE_VP,
                        SCREEN_DEMO,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Opprett aksjeeierbok (med gjenbruk)"
                onPress={async () => {
                    const termsOfUseForvaltVC = (await findVCByType(
                        "TermsOfUseForvaltVC"
                    )) as TermsOfUseForvaltVC;

                    const termsOfUseSymfoniVC = (await findVCByType(
                        "TermsOfUseSymfoniVC"
                    )) as TermsOfUseSymfoniVC;

                    const nationalIdentityVC = (await findVCByType(
                        "NationalIdentityVC"
                    )) as NationalIdentityVC;

                    const request =
                        formatJsonRpcRequest<CreateCapTableVPParams>(
                            "symfoniID_createCapTableVP",
                            {
                                verifier: "demo",
                                capTable: {
                                    organizationNumber: "demo",
                                    shareholders: [],
                                },
                                termsOfUseForvaltVC,
                                termsOfUseSymfoniVC,
                                nationalIdentityVC,
                            }
                        );
                    console.info({ request });

                    const result = await navigateWithResult(
                        SCREEN_CREATE_CAP_TABLE_VP,
                        SCREEN_DEMO,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Overføre Aksjer"
                onPress={async () => {
                    const request =
                        formatJsonRpcRequest<CapTablePrivateTokenTransferParams>(
                            "symfoniID_capTablePrivateTokenTransferVP",
                            {
                                verifier: "demo",
                                toShareholder: {
                                    name: "Jon Ramvi",
                                    amount: "22",
                                },
                            }
                        );

                    const result = await navigateWithResult(
                        SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP,
                        SCREEN_DEMO,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Overføre Aksjer (med gjenbruk)"
                onPress={async () => {
                    const nationalIdentityVC = (await findVCByType(
                        "NationalIdentityVC"
                    )) as NationalIdentityVC;

                    const termsOfUseForvaltVC = (await findVCByType(
                        "TermsOfUseForvaltVC"
                    )) as TermsOfUseForvaltVC;

                    const termsOfUseSymfoniVC = (await findVCByType(
                        "TermsOfUseSymfoniVC"
                    )) as TermsOfUseSymfoniVC;

                    const request =
                        formatJsonRpcRequest<CapTablePrivateTokenTransferParams>(
                            "symfoniID_capTablePrivateTokenTransferVP",
                            {
                                verifier: "demo",
                                toShareholder: {
                                    name: "Jon Ramvi",
                                    amount: "22",
                                },
                                nationalIdentityVC,
                                termsOfUseSymfoniVC,
                                termsOfUseForvaltVC,
                            }
                        );

                    const result = await navigateWithResult(
                        SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP,
                        SCREEN_DEMO,
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: BankID"
                onPress={async () => {
                    const request = makeBankIDRequest({
                        resultScreen: SCREEN_DEMO,
                    });

                    const result = await navigateWithResult(
                        SCREEN_BANKID,
                        SCREEN_DEMO,
                        request
                    );

                    console.info({ result });
                }}
            />
        </>
    );
}

export function demoVerifiablePresentationScreenRequest(): JsonRpcRequest<VerifiablePresentationParams> {
    return formatJsonRpcRequest<VerifiablePresentationParams>(
        "https://symfoni.id/jsonrpc/v2021-10-27/requestVerifiablePresentation",
        {
            verifier: {
                id: "https://www.example.com",
                name: "Demo",
            },
            reason: [{ locale: "no", text: "For demonstration purposes" }],
            verifiableCredential: [],
        }
    );
}
