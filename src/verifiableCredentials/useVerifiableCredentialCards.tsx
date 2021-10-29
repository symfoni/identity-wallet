// React
import React, { useMemo } from "react";
import { Text } from "react-native";
import { decodeJWT } from "did-jwt";

// Local
import { NationalIdentityVC } from "./NationalIdentityVC";
import { NationalIdentityVCCard } from "./NationalIdentityVCCard";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
    TermsOfUseVC,
} from "./TermsOfUseVC";
import { SupportedVerifiableCredential } from "./SupportedVerifiableCredentials";
import { TermsOfUseVCCard } from "./TermsOfUseVCCard";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import { ScreenResult } from "../types/ScreenResults";
import { makeBankIDScreenRequest } from "../types/ScreenRequest";
import { BankIDResult } from "../types/resultTypes";
import {
    SCREEN_BANKID,
    SCREEN_VERIFIABLE_PRESENTATION,
} from "../hooks/useLocalNavigation";
import { BankidJWTPayload } from "../types/bankid.types";
import { useSymfoniContext } from "../context";

// Hook
export function useVerifiableCredentialCards(
    verifiableCredentials: SupportedVerifiableCredential[],
    onSigned: (vc: SupportedVerifiableCredential) => void,
    screenResult?: ScreenResult<BankIDResult>
) {
    const { createVC } = useSymfoniContext();
    const { navigateWithResult } = useNavigationWithResult(
        screenResult?.result
    );

    const onPressSignNationalIdentityCard = async (vc) => {
        const request = makeBankIDScreenRequest(
            SCREEN_VERIFIABLE_PRESENTATION,
            "navigate-to-bankid-screen-from-national-identity-card-and-wait-for-result",
            {}
        );
        const { result } = await navigateWithResult(SCREEN_BANKID, request);

        const bankID = decodeJWT(result.bankIDToken)
            .payload as BankidJWTPayload;

        try {
            const signedVC = (await createVC({
                credential: {
                    ...vc,
                    credentialSubject: {
                        nationalIdentityNumber: bankID.socialno,
                    },
                    evidence: {
                        type: "BankID",
                        jwt: result.bankIDToken,
                    },
                },
            })) as NationalIdentityVC;
            onSigned(signedVC);
        } catch (err) {
            console.warn(
                "NationalIdentityVCCard.tsx: await createVC -> error: ",
                err
            );
        }
    };

    const onPressSignTermsOfUseCard = async (vc: TermsOfUseVC) => {};

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
                                                        onPressSign={
                                                            onPressSignTermsOfUseCard
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
