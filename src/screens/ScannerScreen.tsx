import React, { useContext } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Scanner } from "../components/scanner/Scanner";
import { useLocalNavigation } from "../hooks/useLocalNavigation";
import { Context } from "./../context";

export const ScannerScreen = () => {
    const { navigateHome, navigatePresentCredential } = useLocalNavigation();

    const { isTest, hasTrustedIdentity, pair, pairCached, client } =
        useContext(Context);

    async function onInput(maybeURI: any) {
        console.log("onRead", maybeURI);
        maybeURI = "wc:hei";
        if (typeof maybeURI !== "string") {
            console.warn("typeof maybeURI !== 'string': ", maybeURI);
            return;
        }
        if (!maybeURI.startsWith("wc:")) {
            console.warn("!maybeURI.startsWith('wc:'): ", maybeURI);
            return;
        }

        const URI = maybeURI;
        navigatePresentCredential();
    }

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <Scanner onInput={onInput} />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    actionContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
});
