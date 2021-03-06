// Third party
import React, { useState } from "react";
import styled from "styled-components/native";

// Local
import { SignButton } from "./components/SignButton";
import { CapTableVC } from "./CapTableVC";

export function CapTableVCCard({
    vc,
    onPressSign,
}: {
    vc: CapTableVC;
    onPressSign: (vc: CapTableVC) => void;
}) {
    const signed = !!vc.proof;
    const [loading, setLoading] = useState(false);

    const boardDirector = (
        vc.credentialSubject?.capTable.shareholders ?? []
    ).find((s) => s.isBoardDirector);
    const shareholders = (
        vc.credentialSubject?.capTable.shareholders ?? []
    ).filter((s) => !s.isBoardDirector);

    return (
        <VCCard>
            <VCPropText>Godta aksjeeierbok?</VCPropText>

            <VCPropLabel>Organisasjonsnummer</VCPropLabel>
            <VCPropText>
                {vc.credentialSubject?.capTable.organizationNumber}
            </VCPropText>
            <VCPropLabel>Styreleder</VCPropLabel>
            <VCPropText>{boardDirector?.name}</VCPropText>

            <VCPropLabel>Aksjonærer</VCPropLabel>
            {shareholders.map((s) => (
                <VCPropText>- {s.name}</VCPropText>
            ))}
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

const VCPropText = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 19px;
    margin-bottom: 7px;
`;
