import { useTheme } from "@react-navigation/native";
import { BigNumber, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Buttons, Sizing, Typography } from "../../styles";
import { body, header } from "../../styles/typography";
import { Context } from "../../context";
import { SymfoniButton } from "../ui/button";
import { AddressTextView, DidTextView } from "../ui/text";
import {
    ColorContext,
    ColorContextProvider,
    ColorSystem,
} from "../../colorContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WalletInfo = () => {
    const { isTest, accounts, provider, deleteVeramoData, identity } =
        useContext(Context);
    const [balance, setBalance] = useState<BigNumber>(ethers.constants.Zero);
    const [address, setAddress] = useState(() => accounts[0].split(":").pop());
    // const { colors } = useTheme();
    const { colors, toggleDarkMode } = useContext(ColorContext);
    const styles = makeStyles(colors);

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

    const printAsyncStorage = async () => {
        const stor = await AsyncStorage.getAllKeys();
        stor.forEach(async (item) =>
            console.log("async item", item, await AsyncStorage.getItem(item))
        );
    };

    const clearAsyncStorage = async () => {
        await printAsyncStorage();
        console.log("Clearing storage");
        AsyncStorage.clear();
    };

    if (!address) {
        return <ActivityIndicator />;
    }
    return (
        <View style={styles.grid}>
            <Text style={styles.title}>Your data</Text>
            <Text style={styles.subtitle}>
                Caution, be careful what you do here!
            </Text>
            <View style={styles.row}>
                <Text style={styles.bodyText}>Adresse</Text>
                <AddressTextView style={styles.bodyText} address={address} />
            </View>
            <View style={styles.row}>
                <Text style={styles.bodyText}>Balanse</Text>
                <Text style={styles.bodyText}>
                    {ethers.utils.formatEther(balance)}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.bodyText}>DID</Text>
                <DidTextView
                    style={styles.bodyText}
                    did={identity ? identity.did : "Ingen DID"}
                />
            </View>

            <View style={styles.buttons}>
                <SymfoniButton
                    style={{ marginEnd: 10, maxHeight: 100, maxWidth: 200 }}
                    type="primary"
                    text="Delete Veramo"
                    onPress={() => deleteVeramoData()}
                />
                <SymfoniButton
                    style={{ marginEnd: 10, maxHeight: 100, maxWidth: 200 }}
                    type="primary"
                    text="Delete Local Data"
                    onPress={() => clearAsyncStorage()}
                />
            </View>
            <View>
                <View style={styles.row}>
                    <Text style={styles.title}>Modus</Text>
                </View>
                <SymfoniButton
                    text={"TOD: Endre til test"}
                    type="primary"
                    onPress={() => {
                        toggleDarkMode();
                    }}
                />
            </View>
        </View>
    );
};

const makeStyles = (colors: ColorSystem) => {
    return StyleSheet.create({
        title: {
            ...header.x70,
            marginBottom: 5,
            color: colors.onBackground,
        },
        subtitle: {
            ...body.x20,
            marginBottom: 40,
            color: colors.onBackground,
        },
        grid: {
            backgroundColor: colors.background,
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: Sizing.layout.x30,
        },
        row: {
            marginBottom: Sizing.layout.x10,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        buttons: {
            flexDirection: "row",
            justifyContent: "space-around",
            margin: Sizing.layout.x10,
            marginBottom: 45,
        },
        button: {
            ...Buttons.bar.primary,
            alignSelf: "center",
            marginVertical: Sizing.layout.x20,
            borderRadius: Sizing.layout.x5,
        },
        buttonText: {
            ...Buttons.barText.primary,
        },
        bodyText: {
            ...Typography.body.x30,
            color: colors.onBackground,
        },
    });
};
