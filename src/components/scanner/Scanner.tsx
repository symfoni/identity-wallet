import React from "react";
import { Linking } from "react-native";
import { Button, StyleSheet, Text, TextInput } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";

export const Scanner = ({
    onInput,
}: {
    onInput: (maybeURI: String) => void;
}) => {
    return (
        <>
            <QRCodeScanner
                onRead={(e: any) => onInput(e.data)}
                fadeIn={false}
                showMarker={true}
            />
            {false && (
                <TextInput
                    style={styles.wcText}
                    placeholder="Eller skriv WC kode her"
                    onChangeText={(text: string) => onInput(text)}
                    defaultValue={""}
                    showSoftInputOnFocus={false}
                />
            )}
            <Text style={styles.centerText}>
                Scan QR-kode for å koble til en
                <Text
                    style={styles.hyperlink}
                    onPress={() => Linking.openURL("https://symfoni.dev")}>
                    {" "}
                    nettside som støtter SymfoniID
                </Text>
            </Text>

            <Button title={""} onPress={() => {}} />
        </>
    );
};

export const styles = StyleSheet.create({
    wcText: {
        borderColor: "#ccc",
        backgroundColor: "#ccc",
        height: 30,
    },
    centerText: {
        fontSize: 18,
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 0,
    },
    hyperlink: {
        color: "blue",
        textDecorationLine: "underline",
    },
});
