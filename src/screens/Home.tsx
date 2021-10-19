import { JsonRpcResult } from "@json-rpc-tools/types";
import React, { useContext, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAsyncEffect } from "use-async-effect";
import { ColorContext, ColorSystem } from "../colorContext";
import { Scanner } from "../components/scanner";
import { useSymfoniContext } from "../context";
import {
    SCREEN_CREATE_CAP_TABLE_VP,
    useNavigationWithResult,
} from "../hooks/useNavigationWithResult";
import { CreateCapTableVPResult } from "../types/createCapTableVPTypes";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export const Home = (props: {
    route: { params?: JsonRpcResult<CreateCapTableVPResult> };
}) => {
    const {
        pair,
        loading,
        findNationalIdentityVC,
        findTermsOfUseVC,
        consumeRequestEvent,
        sendResponse,
    } = useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);

    const { navigateWithResult } = useNavigationWithResult(props.route.params);

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
        maybeURI =
            "wc:dcc7f5ebeef34f2212765fe94a516576b5f620621f871085bd7332431f48fc9e@2?controller=false&publicKey=af6d8ddd134b0155b177d6e35ca3368b4ed4a32e0e2fe898ab2968bc7d322860&relay=%7B%22protocol%22%3A%22waku%22%7D";
        const URI = maybeURI;

        // 2. Pair
        try {
            await pair(URI);
        } catch (err) {
            console.warn("ERROR: await pair(URI): ", err);
            return;
        }
    }

    useAsyncEffect(async () => {
        const { topic, request } = await consumeRequestEvent(
            "symfoniID_createCapTableVPRequest"
        );

        // Get existing VCs if exist.
        request.params.capTableTermsOfUseVC = await findTermsOfUseVC();
        request.params.nationalIdentityVC = await findNationalIdentityVC();

        const result = await navigateWithResult(
            SCREEN_CREATE_CAP_TABLE_VP,
            request
        );

        setCreateCapTableVP(result.result.createCapTableVP);
        sendResponse(topic, result);
    }, []);

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
