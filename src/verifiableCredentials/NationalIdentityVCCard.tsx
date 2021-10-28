// React
import React, { useState } from "react";

// Third party
import styled from "styled-components/native";
import { decodeJWT } from "did-jwt";

// Local
import { NationalIdentityVC } from "./NationalIdentityVC";
import { SignButton } from "./components/SignButton";
import { VerifiablePresentationScreenParams } from "../types/ScreenParams";
import { BankIDResult } from "../types/resultTypes";
import { useNavigateBankIDWithResult } from "../hooks/useNavigationWithResult";
import { makeBankIDScreenRequest } from "../types/ScreenRequest";
import { SCREEN_VERIFIABLE_PRESENTATION } from "../hooks/useLocalNavigation";
import { useSymfoniContext } from "../context";
import { BankidJWTPayload } from "../types/bankid.types";

// Card
export function NationalIdentityVCCard({
    vc,
    screenParams,
    onSigned,
}: {
    vc: NationalIdentityVC | undefined;
    screenParams?: VerifiablePresentationScreenParams;
    onSigned: (vc: NationalIdentityVC) => void;
}) {
    const { createVC } = useSymfoniContext();
    const { navigateBankIDWithResult } = useNavigateBankIDWithResult();
    const [loading, setLoading] = useState(false);
    const signed = !!vc?.proof;

    const onSign = async () => {
        const screenRequest = makeBankIDScreenRequest(
            SCREEN_VERIFIABLE_PRESENTATION
        );

        const bankIDResult: BankIDResult = await navigateBankIDWithResult(
            screenRequest
        );

        const bankID = decodeJWT(bankIDResult.bankIDToken)
            .payload as BankidJWTPayload;

        try {
            const signedVC = (await createVC({
                credential: {
                    credentialSubject: {
                        nationalIdentityNumber: bankID.socialno,
                    },
                    evidence: {
                        type: "BankID",
                        jwt: bankIDResult.bankIDToken,
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

    return (
        <VCCard>
            <VCPropLabel>Fødselsnummer</VCPropLabel>
            <VCPropText placeholder={!signed}>
                {vc?.credentialSubject?.nationalIdentityNumber ??
                    "123456 54321"}
            </VCPropText>
            <SignButton
                loading={loading}
                signed={signed}
                expirationDate={vc?.expirationDate}
                onPress={onSign}
            />
        </VCCard>
    );
}

const VCCard = styled.View`
    background-color: rgb(105, 105, 107);
    border-radius: 8px;
    margin-top: 15px;
    margin-bottom: 2px;
    padding-horizontal: 10px;
    padding-top: 25px;
    padding-bottom: 10px;
`;

const VCPropLabel = styled.Text`
    margin-top: 5px;
    color: #fff;
`;

const VCPropText = styled.Text`
    color: ${(props: { placeholder: boolean }) =>
        props.placeholder ? "rgba(255,255,255,0.2)" : "white"};
    font-weight: bold;
    font-size: 19px;
    margin-bottom: 7px;
`;

const VCPropHyperlink = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 17.5px;
    margin-bottom: 25px;
`;
