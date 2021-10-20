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
import { SCREEN_CREATE_CAP_TABLE_VP } from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import { CreateCapTableVPResult } from "../types/capTableTypes";
import { CreateCapTableVP } from "../verifiablePresentations/CreateCapTableVP";

export const Home = (props: {
    route: { params?: JsonRpcResult<CreateCapTableVPResult> };
}) => {
    const {
        pair,
        loading,
        findNationalIdentityVC,
        findTermsOfUseVC,
        consumeEvent,
        sendResponse,
    } = useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);

    const { navigateWithResult } = useNavigationWithResult(props.route.params);

    const [loadingRequest, setLoadingRequest] = useState(false);

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
        setLoadingRequest(true);
    }

    useAsyncEffect(async () => {
        const { topic, request } = await consumeEvent(
            "symfoniID_createCapTableVP"
        );
        setLoadingRequest(false);

        // Get existing VCs if exist.
        request.params.capTableTermsOfUseVC = await findTermsOfUseVC();
        request.params.nationalIdentityVC = await findNationalIdentityVC();

        const result = await navigateWithResult(
            SCREEN_CREATE_CAP_TABLE_VP,
            request
        );

        console.log({ result });
        sendResponse(topic, result);
    }, []);

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.actionContainer}>
                        <Scanner onInput={onScanQR} />
                        {loadingRequest && <Text>Loading request...</Text>}
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
