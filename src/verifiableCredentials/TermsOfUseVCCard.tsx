// Third party
import React, { useState } from "react";
import { Linking } from "react-native";
import styled from "styled-components/native";

// Local
import { SignButton } from "./components/SignButton";
import { TermsOfUseVC } from "./TermsOfUseVC";

export function TermsOfUseVCCard({
    vc,
    onPressSign,
}: {
    vc: TermsOfUseVC;
    onPressSign: (vc: TermsOfUseVC) => void;
}) {
    const signed = !!vc.proof;
    const [loading, setLoading] = useState(false);

    const readAndAccepted = vc.credentialSubject?.readAndAccepted?.id;
    return (
        <VCCard>
            <VCPropLabel>Lest og akseptert</VCPropLabel>
            <VCPropHyperlink
                onPress={() =>
                    readAndAccepted ? Linking.openURL(readAndAccepted) : null
                }>
                {readAndAccepted}
            </VCPropHyperlink>
            <SignButton
                signed={signed}
                loading={loading}
                expirationDate={vc?.expirationDate}
                onPress={() => onPressSign(vc)}
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

const VCPropHyperlink = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 17.5px;
    margin-bottom: 25px;
`;
