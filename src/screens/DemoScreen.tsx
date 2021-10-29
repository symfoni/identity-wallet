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
    BankIDResult,
    VerifiablePresentationResult,
} from "../types/resultTypes";
import {
    makeBankIDScreenRequest,
    makeCapTablePrivateTokenTransferScreenRequest,
    makeCreateCapTableVPScreenRequest,
    makeVerifiablePresentationScreenRequest,
} from "../types/ScreenRequest";
import { ScreenResult } from "../types/ScreenResults";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
    TermsOfUseVC,
} from "../verifiableCredentials/TermsOfUseVC";

export function DemoScreen(props: {
    route: {
        params?:
            | ScreenResult<BankIDResult>
            | ScreenResult<VerifiablePresentationResult>;
    };
}) {
    const { findVCByType } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult(
        props.route.params?.result
    );

    return (
        <>
            <Button
                title="Demo: Generic VP Screen"
                onPress={async () => {
                    const request = makeVerifiablePresentationScreenRequest(
                        SCREEN_DEMO,
                        "demo_requestVerifiablePresentation",
                        {
                            verifier: {
                                id: "https://www.example.com",
                                name: "Demo skjerm",
                                reason: "Demonstrere generisk VPskjerm",
                            },
                            verifiableCredentials: [
                                {
                                    "@context": [
                                        "https://www.w3.org/2018/credentials/v1",
                                        "https://www.symfoni.id/credentials/v1",
                                    ],
                                    type: [
                                        "VerifiableCredential",
                                        "NationalIdentityVC",
                                    ],
                                } as NationalIdentityVC,
                                {
                                    "@context": [
                                        "https://www.w3.org/2018/credentials/v1",
                                        "https://www.symfoni.id/credentials/v1",
                                    ],
                                    type: [
                                        "VerifiableCredential",
                                        "TermsOfUseVC",
                                        "TermsOfUseForvaltVC",
                                    ],
                                    credentialSubject: {
                                        readAndAccepted: {
                                            id: "https://forvalt.no/TOA",
                                        },
                                    },
                                } as TermsOfUseForvaltVC,
                                {
                                    "@context": [
                                        "https://www.w3.org/2018/credentials/v1",
                                        "https://www.symfoni.id/credentials/v1",
                                    ],
                                    type: [
                                        "VerifiableCredential",
                                        "TermsOfUseVC",
                                        "TermsOfUseSymfoniVC",
                                    ],
                                    credentialSubject: {
                                        readAndAccepted: {
                                            id: "https://symfoni.id/TOA",
                                        },
                                    },
                                } as TermsOfUseSymfoniVC,
                            ],
                        }
                    );

                    const result = await navigateWithResult(
                        SCREEN_VERIFIABLE_PRESENTATION,
                        request
                    );

                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Opprett aksjeeierbok"
                onPress={async () => {
                    const request = makeCreateCapTableVPScreenRequest(
                        SCREEN_DEMO,
                        "demo_createCapTableVP",
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
                    const request = makeCreateCapTableVPScreenRequest(
                        SCREEN_DEMO,
                        "demo_createCapTableVP",
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
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: Overføre Aksjer"
                onPress={async () => {
                    const request =
                        makeCapTablePrivateTokenTransferScreenRequest(
                            SCREEN_DEMO,
                            "demo_capTablePrivateTokenTransferVP",
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
                        makeCapTablePrivateTokenTransferScreenRequest(
                            SCREEN_DEMO,
                            "demo_capTablePrivateTokenTransferVP",
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
                        request
                    );
                    console.info({ result });
                }}
            />
            <Button
                title="Demo: BankID"
                onPress={async () => {
                    const request = makeBankIDScreenRequest(
                        SCREEN_DEMO,
                        "Demo_bankIDRequest",
                        {}
                    );

                    const result = await navigateWithResult(
                        SCREEN_BANKID,
                        request
                    );

                    console.info({ result });
                }}
            />
        </>
    );
}
