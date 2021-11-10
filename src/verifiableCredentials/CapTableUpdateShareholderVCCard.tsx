// Third party
import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { CapTableUpdateShareholderVC } from "./CapTableUpdateShareholderVC";
// Local
import { SignButton } from "./components/SignButton";

export function CapTableUpdateShareholderVCCard({
    vc,
    onPressSign,
}: {
    vc: CapTableUpdateShareholderVC;
    onPressSign: (vc: CapTableUpdateShareholderVC) => void;
}) {
    const signed = !!vc.proof;
    const [loading, setLoading] = useState(false);

    const getValueString = (value: string | undefined | null) => {
        switch (value) {
            case undefined:
                return "INGEN ENDRING";
            case null:
                return "SLETT";
            default:
                return value;
        }
    };

    const getKeyString = (value: string) => {
        switch (value) {
            case "name":
                return "Navn";
            case "email":
                return "Epost";
            case "birthdate":
                return "Født";
            case "postcode":
                return "Postkode";
            case "city":
                return "By";
            default:
                return value;
        }
    };

    return (
        <VCCard>
            <VCPropLabel>Bekreft endringer for bruker</VCPropLabel>
            <VCPropText>{vc.credentialSubject?.shareholderId}</VCPropText>
            {Object.entries(vc.credentialSubject.shareholderData).map(
                ([key, value], index) => {
                    return (
                        <View key={index}>
                            <VCPropLabel>{getKeyString(key)}</VCPropLabel>
                            <VCPropText>{getValueString(value)}</VCPropText>
                        </View>
                    );
                }
            )}

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
