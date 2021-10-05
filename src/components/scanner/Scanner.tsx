import React, { useContext } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Context } from "./../../context";

export const Scanner = () => {
    const { client, isTest, pair } = useContext(Context);

    async function onRead(data: any) {
        console.log("onRead", data);
        if (typeof data !== "string") {
            return;
        }
        if (!data.startsWith("wc:")) {
            return;
        }
        try {
            if (typeof client === "undefined") {
                return;
            }
            await pair(data, true);
        } catch (e) {
            console.error(e);
            return;
        }
    }

    async function onTextInput(uri: string) {
        console.log(onTextInput, uri);
        try {
            if (!uri.startsWith("wc:")) {
                return;
            }
            if (!client) {
                throw Error("WalletConnect client not initialized");
            }
            const pairResult = await pair(uri);
            console.debug("pairResult", pairResult);
        } catch (error) {
            throw error;
        }
    }

    return (
        <>
            <QRCodeScanner
                onRead={(e: any) => onRead(e.data)}
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
                    onChangeText={(text: string) => onTextInput(text)}
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
