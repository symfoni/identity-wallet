import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import { ColorContext, ColorSystem } from "../colorContext";
import { Button, SymfoniButton } from "../components/ui/button";
import { Context } from "../context";
import { navigate } from "../navigation";

export const Home = () => {
    const { loading, client, closeSession } = useContext(Context);
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);
    const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);
    const activeSessions = client?.session.values.length;

    useEffect(() => {
        let subscribed = true;
        if (!client) {
            return;
        }
        setSessions(client.session.values);
        console.log("Setting sessions");
        client.on(CLIENT_EVENTS.session.deleted, (some: any) => {
            console.log("deleted", some);
            if (subscribed) {
                setSessions(client.session.values);
            }
        });
        client.on(CLIENT_EVENTS.session.created, (some: any) => {
            console.log("created", some);
            if (subscribed) {
                setSessions(client.session.values);
            }
        });
        return () => {
            subscribed = false;
        };
    }, [client, client?.session]);

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.actionContainer}>
                        <SymfoniButton
                            icon={"qr"}
                            type="primary"
                            text="Scan QR"
                            onPress={() => navigate("Scanner")}
                        />
                    </View>
                )}
            </SafeAreaView>
        </>
    );
};

const makeStyles = (colors: ColorSystem) => {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            flex: 1,
            padding: 10,
            justifyContent: "center",
        },
        actionContainer: {
            flexDirection: "row",
            alignSelf: "center",
        },
    });
};
