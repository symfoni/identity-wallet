// Third party
import React, { useState } from "react";
import styled from "styled-components/native";

// Local
import { NationalIdentityVC } from "./NationalIdentityVC";
import { SignButton } from "./components/SignButton";

// Card
export function NationalIdentityVCCard({
    vc,
    onPressSign,
}: {
    vc: NationalIdentityVC;
    onPressSign: (vc: NationalIdentityVC) => void;
}) {
    const [loading, setLoading] = useState(false);
    const signed = !!vc?.proof;

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

const VCPropText = styled.Text`
    color: ${(props: { placeholder: boolean }) =>
        props.placeholder ? "rgba(255,255,255,0.2)" : "white"};
    font-weight: bold;
    font-size: 19px;
    margin-bottom: 7px;
`;
