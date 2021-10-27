import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import React from "react";
import { Button } from "react-native";
import { useSymfoniContext } from "../context";
import {
    SCREEN_CREATE_CAP_TABLE_VP,
    SCREEN_DEMO,
    SCREEN_BANKID,
    SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP,
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

export function DemoScreen() {
    const { findVCByType } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult();

    return (
        <>
            <Button
                title="Demo: Vis Legitimasjon"
                onPress={async () => {
                    const request = makeBankIDRequest({
                        resultScreen: SCREEN_DEMO,
                    });

                    const result = await navigateWithResult(
                        SCREEN_BANKID,
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
                        request
                    );

                    console.info({ result });
                }}
            />
        </>
    );
}
