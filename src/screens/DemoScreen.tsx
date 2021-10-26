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
                title="Demo: Lag ny legitimasjon"
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
                title="Demo: Bruk eksisterende legitimasjon dersom finnes"
                onPress={async () => {
                    const capTableTermsOfUseVC = (await findVCByType(
                        "TermsOfUseForvaltVC"
                    )) as TermsOfUseForvaltVC;
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
                                capTableTermsOfUseVC,
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
            <Button
                title="Demo: TransferShare"
                onPress={async () => {
                    const nationalIdentityVC = (await findVCByType(
                        "NationalIdentityVC"
                    )) as NationalIdentityVC;

                    const termsOfUseForvaltVC = (await findVCByType(
                        "TermsOfUseForvaltVC"
                    )) as TermsOfUseForvaltVC;

                    const termsOfUseSymfoniVC = (await findVCByType(
                        "TermsOfUseSymfonVC"
                    )) as TermsOfUseSymfoniVC;

                    const request =
                        formatJsonRpcRequest<CapTablePrivateTokenTransferParams>(
                            "symfoniID_createCapTablePrivateTokenTransferVP",
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
                }}>
                Demo: Transfer Share
            </Button>
            <Button
                title="Demo: Transfer Share uten storage"
                onPress={async () => {
                    const request =
                        formatJsonRpcRequest<CapTablePrivateTokenTransferParams>(
                            "symfoniID_createCapTablePrivateTokenTransferVP",
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
                }}>
                Demo: Transfer Share
            </Button>
        </>
    );
}
