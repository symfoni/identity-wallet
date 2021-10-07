import React, { useContext } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Context } from "./../../context";

export const Scanner = ({
    onInput,
}: {
    onInput: (maybeURI: String) => void;
}) => {
    const { isTest } = useContext(Context);

    return (
        <>
            <QRCodeScanner
                onRead={(e: any) => onInput(e.data)}
                fadeIn={false}
                showMarker={true}
                topContent={
                    <Text style={styles.centerText}>
                        Scan WalletConnect QRcode
                    </Text>
                }
            />
            {isTest && (
                <TextInput
                    style={styles.inputText}
                    placeholder="Eller skriv WC kode her"
                    onChangeText={(text: string) => onInput(text)}
                    defaultValue={""}
                    showSoftInputOnFocus={false}
                />
            )}
        </>
    );
};

export const styles = StyleSheet.create({
    inputText: {
        borderColor: "#ccc",
        backgroundColor: "#ccc",
        height: 40,
        margin: 10,
    },
    centerText: {
        flex: 0.5,
        fontSize: 18,
        paddingTop: 20,
        color: "#000",
    },
    textBold: {
        fontWeight: "500",
        color: "#fff",
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)",
    },
    button: {
        padding: 16,
    },
});
