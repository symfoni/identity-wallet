import { useState } from "react";
import styled from "styled-components/native";
import { CapTableClaimTokenVC } from "./CapTableClaimTokenVC";
// Local
import { SignButton } from "./components/SignButton";

export function CapTableClaimTokenVCCard({
    vc,
    onPressSign,
}: {
    vc: CapTableClaimTokenVC;
    onPressSign: (vc: CapTableClaimTokenVC) => void;
}) {
    const signed = !!vc.proof;
    const [loading, setLoading] = useState(false);

    return (
        <VCCard>
            <VCPropLabel>Gjør krav på</VCPropLabel>
            <VCPropText>
                {/*TODO Hvordan vise disse addressene*/}
                {vc.credentialSubject?.claimTokens} aksjer
            </VCPropText>
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
