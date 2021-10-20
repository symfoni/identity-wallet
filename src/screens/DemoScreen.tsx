import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import React from "react";
import { Button } from "react-native";
import { useSymfoniContext } from "../context";
import {
    SCREEN_CREATE_CAP_TABLE_VP,
    SCREEN_DEMO,
    SCREEN_BANKID,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import { CreateCapTableVPParams } from "../types/capTableTypes";
import { makeBankIDRequest } from "../types/paramTypes";

export function DemoScreen() {
    const { findTermsOfUseVC, findNationalIdentityVC } = useSymfoniContext();
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
                    const capTableTermsOfUseVC = await findTermsOfUseVC();
                    const nationalIdentityVC = await findNationalIdentityVC();

                    const request =
                        formatJsonRpcRequest<CreateCapTableVPParams>(
                            "symfoniID_createCapTableVP",
                            {
                                verifier: "demo",
                                capTableForm: {
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
        </>
    );
}
