// React
import React from "react";

// Third party
import styled from "styled-components/native";

// Local
import { NationalIdentityVC } from "./NationalIdentityVC";
import { SignButton } from "./components/SignButton";

// Card
export function NationalIdentityVCCard({
    vc,
    loading,
    onSign,
}: {
    vc: NationalIdentityVC | undefined;
    loading: boolean;
    onSign: () => Promise<void>;
}) {
    const signed = !!vc;
    const valid = true;

    return (
        <VCCard>
            <VCPropLabel>Fødselsnummer</VCPropLabel>
            <VCPropText placeholder={valid && !signed}>
                {vc?.credentialSubject?.nationalIdentityNumber ??
                    "123456 54321"}
            </VCPropText>
            <SignButton
                valid={valid}
                loading={loading}
                signed={signed}
                expirationDate={vc?.expirationDate}
                onPress={() => (valid && !signed ? onSign() : null)}
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
