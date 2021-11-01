// Third party
import React, { useState } from "react";
import styled from "styled-components/native";

// Local
import { SignButton } from "./components/SignButton";
import { AccessVC } from "./AccessVC";

export function AccessVCCard({
    vc,
    onPressSign,
}: {
    vc: AccessVC;
    onPressSign: (vc: AccessVC) => void;
}) {
    const signed = !!vc.proof;
    const [loading, setLoading] = useState(false);

    return (
        <VCCard>
            <VCPropLabel>Hvem får tilgang?</VCPropLabel>
            <VCPropText>
                {vc.credentialSubject?.access.delegatedTo.id}
            </VCPropText>
            <VCPropLabel>Hvilke data deles?</VCPropLabel>
            {(vc.credentialSubject?.access.scopes ?? []).map((scope) => {
                return <VCPropText key={scope.id}>{scope.name}</VCPropText>;
            })}
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
