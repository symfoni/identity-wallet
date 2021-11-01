// React
import React, { useMemo } from "react";
import { Text } from "react-native";
import { decodeJWT } from "did-jwt";

// Local
import { NationalIdentityVC } from "./NationalIdentityVC";
import { NationalIdentityVCCard } from "./NationalIdentityVCCard";
import { TermsOfUseVC } from "./TermsOfUseVC";
import { SupportedVerifiableCredential } from "./SupportedVerifiableCredentials";
import { TermsOfUseVCCard } from "./TermsOfUseVCCard";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import { makeBankIDScreenRequest } from "../types/ScreenRequest";
import { BankIDResult } from "../types/resultTypes";
import {
    NAVIGATOR_ROOT,
    SCREEN_BANKID,
    SCREEN_VERIFIABLE_PRESENTATION,
} from "../hooks/useLocalNavigation";
import { BankidJWTPayload } from "../types/bankid.types";
import { useSymfoniContext } from "../context";
import { JsonRpcResult } from "@json-rpc-tools/types";
import { useDeviceAuthentication } from "../hooks/useDeviceAuthentication";
import { CapTableVCCard } from "./CapTableVCCard";
import { CapTablePrivateTokenTransferVCCard } from "./CapTablePrivateTokenTransferVCCard";
import { CapTableVC } from "./CapTableVC";
import { CapTablePrivateTokenTransferVC } from "./CapTablePrivateTokenTransferVC";

// Hook
export function useVerifiableCredentialCards(
    verifiableCredentials: SupportedVerifiableCredential[],
    onSigned: (vc: SupportedVerifiableCredential) => void,
    result?: JsonRpcResult<BankIDResult>
) {
    const { createVC } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult(result);
    const { checkDeviceAuthentication } = useDeviceAuthentication();

    // CALLBACK
    const onPressSignNationalIdentityCard = async (vc: NationalIdentityVC) => {
        const request = makeBankIDScreenRequest(
            SCREEN_VERIFIABLE_PRESENTATION,
            NAVIGATOR_ROOT,
            "navigate-to-bankid-screen-from-national-identity-card-and-wait-for-result",
            {}
        );
        const { result } = await navigateWithResult(SCREEN_BANKID, request);

        const bankID = decodeJWT(result.bankIDToken)
            .payload as BankidJWTPayload;

        const evidence = [
            {
                type: "BankID",
                jwt: result.bankIDToken,
            },
        ];

        try {
            const signedVC = (await createVC({
                credential: {
                    ...vc,
                    credentialSubject: {
                        nationalIdentityNumber: bankID.socialno,
                    },
                    evidence,
                    expirationDate: expiresInBankID(bankID.exp),
                } as NationalIdentityVC,
            })) as NationalIdentityVC;

            console.log(
                "onPressSignNationalIdentityCard:",
                JSON.stringify(signedVC, null, 2)
            );
            onSigned(signedVC);
        } catch (err) {
            console.warn(
                "useVerifiableCredentialCards.tsx: onPressSignNationalIdentityCard(): await veramo.createVC() -> error: ",
                err
            );
        }
    };

    // CALLBACK
    async function onPressSignCard(
        vc: SupportedVerifiableCredential,
        expirationDate: string
    ) {
        const authenticated = await checkDeviceAuthentication();
        if (!authenticated) {
            console.warn(
                "useVerifiableCredentialCards.tsx: onPressSignCard(): !authenticated "
            );
            return;
        }
        try {
            const signedVC = (await createVC({
                credential: {
                    ...vc,
                    expirationDate,
                },
            })) as SupportedVerifiableCredential;
            onSigned(signedVC);
        } catch (err) {
            console.warn(
                "useVerifiableCredentialCards.tsx: : onPressSignCard(): await veramo.createVC() -> error: ",
                err
            );
        }
    }

    // MEMO
    const cards = useMemo(
        () =>
            verifiableCredentials.map((vc) => {
                const key = `${vc["@context"].join(",")}+${vc.type.join(",")}`;

                switch (vc["@context"][0]) {
                    case "https://www.w3.org/2018/credentials/v1": {
                        switch (vc["@context"][1]) {
                            case "https://www.symfoni.id/credentials/v1": {
                                switch (vc.type[0]) {
                                    case "VerifiableCredential": {
                                        switch (vc.type[1]) {
                                            case "NationalIdentityVC": {
                                                return (
                                                    <NationalIdentityVCCard
                                                        key={key}
                                                        vc={
                                                            vc as NationalIdentityVC
                                                        }
                                                        onPressSign={
                                                            onPressSignNationalIdentityCard
                                                        }
                                                    />
                                                );
                                            }
                                            case "TermsOfUseVC": {
                                                return (
                                                    <TermsOfUseVCCard
                                                        key={key}
                                                        vc={vc as TermsOfUseVC}
                                                        onPressSign={(_vc) =>
                                                            onPressSignCard(
                                                                _vc,
                                                                expiresIn50Years()
                                                            )
                                                        }
                                                    />
                                                );
                                            }
                                            case "CapTableVC": {
                                                return (
                                                    <CapTableVCCard
                                                        key={key}
                                                        vc={vc as CapTableVC}
                                                        onPressSign={(_vc) =>
                                                            onPressSignCard(
                                                                _vc,
                                                                expiresIn24Hours()
                                                            )
                                                        }
                                                    />
                                                );
                                            }
                                            case "CapTablePrivateTokenTransferVC": {
                                                return (
                                                    <CapTablePrivateTokenTransferVCCard
                                                        key={key}
                                                        vc={
                                                            vc as CapTablePrivateTokenTransferVC
                                                        }
                                                        onPressSign={(_vc) =>
                                                            onPressSignCard(
                                                                _vc,
                                                                expiresIn24Hours()
                                                            )
                                                        }
                                                    />
                                                );
                                            }
                                            //
                                            // The rest is default fallback cases
                                            //
                                            default: {
                                                console.warn(
                                                    `useVerifiableCredentialCards.tsx: Unknown vc.type[1]: ${vc.type[1]}`
                                                );
                                                return (
                                                    <Text key={key}>
                                                        Unknown VC Type{" "}
                                                        {vc.type[1]}
                                                    </Text>
                                                );
                                            }
                                        }
                                    }
                                    default: {
                                        console.warn(
                                            `useVerifiableCredentialCards.tsx: Unknown vc.type[0]: ${vc.type[0]}`
                                        );
                                        return (
                                            <Text key={key}>
                                                Unknown VC Type {vc.type[0]}
                                            </Text>
                                        );
                                    }
                                }
                            }
                            default: {
                                console.warn(
                                    `useVerifiableCredentialCards.tsx: Unknown vc["@context"][1]: ${vc["@context"][1]}`
                                );
                                return (
                                    <Text key={key}>
                                        Unknown VC Context {vc["@context"][1]}
                                    </Text>
                                );
                            }
                        }
                    }
                    default: {
                        console.warn(
                            `useVerifiableCredentialCards.tsx: Unknown vc["@context"][0]: ${vc["@context"][0]}`
                        );
                        return (
                            <Text key={key}>
                                Unknown VC Context {vc["@context"][0]}
                            </Text>
                        );
                    }
                }
            }),

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [verifiableCredentials]
    );

    return cards;
}

function expiresInBankID(exp: number) {
    return new Date(exp * 1000).toISOString();
}
function expiresIn24Hours() {
    return new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
}

function expiresIn50Years() {
    return new Date(
        new Date().setFullYear(new Date().getFullYear() + 50)
    ).toISOString();
}
