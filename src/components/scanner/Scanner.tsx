import React from "react";
import { Linking } from "react-native";
import { Button } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import styled from "styled-components/native";

// Local
import { useColorContext } from "../../colorContext";

export const Scanner = ({
    onInput,
}: {
    onInput: (maybeURI: String) => void;
}) => {
    const { colors } = useColorContext();

    return (
        <>
            <QRCodeScanner
                onRead={(e: any) => onInput(e.data)}
                fadeIn={false}
                showMarker={true}
            />
            {__DEV__ && (
                <WCText
                    placeholder="Eller skriv WC kode her"
                    onChangeText={(text: string) => onInput(text)}
                    defaultValue={""}
                    showSoftInputOnFocus={false}
                />
            )}
            <CenterText>
                Koble til{" "}
                <Hyperlink
                    color={colors.primary.light}
                    onPress={() => Linking.openURL("https://symfoni.dev/apps")}>
                    tjenester
                </Hyperlink>{" "}
                med QR-leseren.
            </CenterText>
        </>
    );
};

const WCText = styled.TextInput`
    border-color: #ccc;
    background-color: #ccc;
    height: 30px;
`;

const CenterText = styled.Text`
    margin-horizontal: 30px;
    margin-vertical: 30px;
`;
const Hyperlink = styled.Text`
    color: ${(props: { color: string }) => props.color};
    text-decoration-line: underline;
`;
