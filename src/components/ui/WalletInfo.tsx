import { BigNumber, BigNumberish, ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { Context } from "./../../context";
import { Clipboard } from "react-native";

export const WalletInfo = () => {
    const { accounts, provider, deleteVeramoData, identity } =
        useContext(Context);
    const [balance, setBalance] = useState<BigNumber>(ethers.constants.Zero);
    const [address, setAddress] = useState(() =>
        accounts[0]?.split(":")?.pop()
    );

    useEffect(() => {
        const doAsync = async () => {
            if (!provider || !accounts) {
                return;
            }
            try {
                if (!address) {
                    return;
                }
                const balance = await provider.getBalance(address);
                setBalance(balance);
            } catch (error) {
                console.error("Could not fetch balance for address", address);
            }
        };
        doAsync();
    }, [accounts, address, provider]);

    const copy = (text: string) => {
        // REVIEW - Test react-native-clipboard-plus and @react-native-community/clipboard but both gave errors
        Clipboard.setString(text);
        console.info("Copied", text, "to clipboard");
    };

    if (!address) {
        return <ActivityIndicator />;
    }
    return (
        <View style={styles.grid}>
            <Text>Addresse</Text>
            <Text style={styles.infoText} onPress={() => copy(address)}>
                {address}
            </Text>

            <Text>Balanse</Text>
            <Text style={styles.infoText}>
                {ethers.utils.formatEther(balance)}
            </Text>

            <Text>DID</Text>
            <Text
                style={styles.infoText}
                onPress={() => (identity ? copy(identity.did) : "")}>
                {identity ? identity.did : "Ingen DID"}
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => deleteVeramoData()}>
                <Text style={styles.buttonText}>Delete veramo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flex: 1,
        flexDirection: "column",
        margin: 10,
    },
    button: {
        alignSelf: "center",
        backgroundColor: "pink",
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
    },
    infoText: {
        fontSize: 16,
    },
});
