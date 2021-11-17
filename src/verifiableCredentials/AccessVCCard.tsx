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
            <VCPropLabel>Tillat</VCPropLabel>
            <VCPropText>
                {vc.credentialSubject.access.delegatedTo.name}
            </VCPropText>
            <VCPropLabel>Å kunne</VCPropLabel>
            {(vc.credentialSubject?.access.scopes ?? []).map((scope) => {
                return (
                    <VCPropText key={scope.id}>
                        - {capitalizeFirstLetter(scope.name)}
                    </VCPropText>
                );
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

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
