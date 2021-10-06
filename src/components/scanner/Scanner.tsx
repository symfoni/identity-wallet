import React, { useContext } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useLocalNavigation } from "../../hooks/useNavigation";
import { Context } from "./../../context";

export const Scanner = () => {
    const { navigateBankID, navigateHome } = useLocalNavigation();
    const { isTest, hasTrustedIdentity, pair, pairCached, client } =
        useContext(Context);

    async function onInput(maybeURI: any) {
        console.log("onRead", maybeURI);

        if (typeof maybeURI !== "string") {
            console.warn("typeof maybeURI !== 'string': ", maybeURI);
            return;
        }
        if (!maybeURI.startsWith("wc:")) {
            console.warn("!maybeURI.startsWith('wc:'): ", maybeURI);
            return;
        }
        if (!client) {
            console.warn("WalletConnect client not initialized");
            return;
        }
        const URI = maybeURI;

        if (!hasTrustedIdentity) {
            try {
                await pairCached(URI);
            } catch (err) {
                console.warn("ERROR: await pairCached(URI): ", err);
                return;
            }
            navigateBankID();
        } else {
            try {
                await pair(URI);
            } catch (err) {
                console.warn("ERROR: await pair(URI): ", err);
                return;
            }
            navigateHome();
        }
    }

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
