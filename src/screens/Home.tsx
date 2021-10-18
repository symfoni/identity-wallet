import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ColorContext, ColorSystem } from "../colorContext";
import { Scanner } from "../components/scanner";
import { useSymfoniContext } from "../context";
import { useLocalNavigation } from "../hooks/useLocalNavigation";
import {
    CreateCapTableVPResponse,
    CreateCapTableVPRequest,
} from "../types/requestTypes";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export const Home = (props: {
    route: { params?: CreateCapTableVPResponse };
}) => {
    const {
        pair,
        loading,
        client,
        findNationalIdentityVC,
        findTermsOfUseVC,
        setOnRequestVP,
    } = useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);
    const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);
    const activeSessions = client?.session.values.length;
    const { navigatePresentCredential } = useLocalNavigation();

    const [createCapTableVP, setCreateCapTableVP] =
        useState<CreateCapTableVP | null>(null);

    async function onScanQR(maybeURI: any) {
        console.log("onRead", maybeURI);

        // 1. Validate URI
        if (typeof maybeURI !== "string") {
            console.warn("typeof maybeURI !== 'string': ", maybeURI);
            return;
        }
        if (!maybeURI.startsWith("wc:")) {
            console.warn("!maybeURI.startsWith('wc:'): ", maybeURI);
            return;
        }

        const URI = maybeURI;

        // 2. Pair
        try {
            await pair(URI);
        } catch (err) {
            console.warn("ERROR: await pair(URI): ", err);
            return;
        }

        // 3. Get existing VCs if exist.
        // const capTableTermsOfUseVC = await findTermsOfUseVC();
        // const nationalIdentityVC = await findNationalIdentityVC();

        // const request = {
        //     type: "CREATE_CAP_TABLE_VP_REQUEST",
        //     params: {
        //         nationalIdentityVC,
        //         capTableTermsOfUseVC,
        //     },
        // } as CreateCapTableVPRequest;

        // navigatePresentCredential(request);
    }

    // UseEffect() - On requests
    useEffect(() => {
        setOnRequestVP(
            async (_request: CreateCapTableVPRequest | undefined) => {
                switch (_request?.type) {
                    case "CREATE_CAP_TABLE_VP_REQUEST":
                        // Get existing VCs if exist.
                        const capTableTermsOfUseVC = await findTermsOfUseVC();
                        const nationalIdentityVC =
                            await findNationalIdentityVC();
                        const request: CreateCapTableVPRequest = {
                            ..._request,
                            params: {
                                capTableTermsOfUseVC,
                                nationalIdentityVC,
                                ..._request.params,
                            },
                        };
                        console.log("navigatePresentCredential", request);
                        navigatePresentCredential(request);
                        break;
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // UseEffect() - On responses
    useEffect(() => {
        console.info({
            "Home.tsx: props.route.params?.type": props.route.params?.type,
        });
        switch (props.route.params?.type) {
            case "CREATE_CAP_TABLE_VP_RESPONSE":
                sendVP(request, props.route.params.createCapTableVP);

                setCreateCapTableVP(
                    props.route.params.payload.createCapTableVP
                );
                break;

            case "CREATE_CAP_TABLE_VP_ERROR":
                {
                    // Handle error
                }
                break;
        }
    }, [props.route.params]);

    // useEffect() - On session change
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

    if (createCapTableVP) {
        return <Text>{JSON.stringify(createCapTableVP)}</Text>;
    }

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.actionContainer}>
                        <Scanner onInput={onScanQR} />
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
            alignSelf: "center",
        },
    });
};
