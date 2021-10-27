// React
import React from "react";
import { Linking } from "react-native";

// Third party
import styled from "styled-components/native";

// Local
import { SignButton } from "./components/SignButton";
import { TermsOfUseVC } from "./TermsOfUseVC";

// Card
export function TermsOfUseVCCard({
    vc,
    loading,
    VCType,
    termsOfUseID,
    onSign,
}: {
    vc: TermsOfUseVC | undefined;
    loading: boolean;
    VCType: string;
    termsOfUseID: string;
    onSign: (VCType: string, termsOfUse: string) => void;
}) {
    const signed = !!vc;

    return (
        <VCCard>
            <VCPropLabel>Lest og akseptert</VCPropLabel>
            <VCPropHyperlink onPress={() => Linking.openURL(termsOfUseID)}>
                {termsOfUseID}
            </VCPropHyperlink>
            <SignButton
                valid={true}
                signed={signed}
                loading={loading}
                expirationDate={vc?.expirationDate}
                onPress={() => onSign(VCType, termsOfUseID)}
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
