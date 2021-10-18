import { resolveProperties } from "@ethersproject/properties";
import { JsonRpcRequest } from "@json-rpc-tools/types";
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
    CreateCapTableVPRequest,
    CreateCapTableVPResult,
} from "../types/createCapTableVPTypes";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export const Home = (props: { route: { params?: CreateCapTableVPResult } }) => {
    const {
        pair,
        loading,
        findNationalIdentityVC,
        findTermsOfUseVC,
        setOnRequest,
        sendResponse,
    } = useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);
    const { navigateCreateCapTableVP } = useLocalNavigation();

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

        // navigateCreateCapTableVP(request);
    }

    // UseEffect() - On requests
    const [event, setEvent] =
        useState<{ topic: string; request: CreateCapTableVPRequest }>();

    useEffect(() => {
        setOnRequest(
            "symfoniID_createCapTableVPRequest",
            async (topic: string, _request: CreateCapTableVPRequest) => {
                // Get existing VCs if exist.
                const capTableTermsOfUseVC = await findTermsOfUseVC();
                const nationalIdentityVC = await findNationalIdentityVC();

                _request = {
                    ..._request,
                    method: "symfoniID_createCapTableVPRequest",
                    params: {
                        ..._request.params,
                        capTableTermsOfUseVC,
                        nationalIdentityVC,
                    },
                };

                console.info(
                    "navigateCreateCapTableVP with request: ",
                    _request
                );
                setEvent({ topic, request: _request });
                navigateCreateCapTableVP(_request);
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // UseEffect() - On response
    useEffect(
        () => {
            console.info(
                "Home.tsx: props.route.params?.id:",
                props.route.params?.id
            );

            if (
                event?.topic &&
                event.request.method === "symfoniID_createCapTableVPRequest" &&
                props.route.params?.id === event?.request.id
            ) {
                const result = props.route.params as CreateCapTableVPResult;

                setCreateCapTableVP(result.result.createCapTableVP);
                sendResponse(event?.topic, result);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.route.params?.id, event]
    );

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
