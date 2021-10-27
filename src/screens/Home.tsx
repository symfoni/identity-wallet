import { JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import React, { useContext, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import { useAsyncEffect } from "use-async-effect";
import { ColorContext, ColorSystem } from "../colorContext";
import { Scanner } from "../components/scanner";
import { useSymfoniContext } from "../context";
import {
    SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP,
    SCREEN_CREATE_CAP_TABLE_VP,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import {
    CapTablePrivateTokenTransferResult,
    CreateCapTableVPResult,
} from "../types/capTableTypes";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";

export const Home = (props: {
    route: {
        params?: JsonRpcResult<
            CreateCapTableVPResult | CapTablePrivateTokenTransferResult
        >;
    };
}) => {
    const { pair, loading } = useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);

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
    }

    useEffectCreateCapTableVP(props.route.params);
    useEffectCreateCapTablePrivateTokenTransferVP(props.route.params);

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

/**
 * Listen, navigate, get navigation result and send response
 */
function useEffectCreateCapTableVP(
    params?: JsonRpcResult<
        CreateCapTableVPResult | CapTablePrivateTokenTransferResult
    >
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(params);

    useAsyncEffect(async () => {
        while (client) {
            const { topic, request } = await consumeEvent(
                "symfoniID_createCapTableVP"
            );

            // Get existing VCs if exist.
            request.params = request.params[0];
            request.params.termsOfUseForvaltVC = await findVCByType(
                "TermsOfUseForvaltVC"
            );
            request.params.termsOfUseSymfoniVC = await findVCByType(
                "TermsOfUseSymfoniVC"
            );
            request.params.nationalIdentityVC = (await findVCByType(
                "NationalIdentityVC"
            )) as NationalIdentityVC;

            const result = (await navigateWithResult(
                SCREEN_CREATE_CAP_TABLE_VP,
                request
            )) as JsonRpcResult<CreateCapTableVPResult>;

            console.log({ result });
            sendResponse(topic, {
                ...result,
                result: {
                    ...result.result,
                    createCapTableVP: result.result.createCapTableVP.proof.jwt,
                },
            });
        }
    }, [client]);
}

/**
 * Listen, navigate, get navigation result and send response
 */
function useEffectCreateCapTablePrivateTokenTransferVP(
    params?: JsonRpcResult<
        CapTablePrivateTokenTransferResult | CreateCapTableVPResult
    >
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(params);

    useAsyncEffect(async () => {
        while (client) {
            const { topic, request } = await consumeEvent(
                "symfoniID_capTablePrivateTokenTransferVP"
            );

            // Get existing VCs if exist.
            // TODO get correct terms of use
            request.params = request.params[0];
            request.params.termsOfUseForvaltVC = await findVCByType(
                "TermsOfUseForvaltVC"
            );
            request.params.termsOfUseSymfoniVC = await findVCByType(
                "TermsOfUseSymfoniVC"
            );
            request.params.nationalIdentityVC = (await findVCByType(
                "NationalIdentityVC"
            )) as NationalIdentityVC;

            const result = (await navigateWithResult(
                SCREEN_CREATE_CAP_TABLE_PRIVATE_TOKEN_TRANSFER_VP,
                request
            )) as JsonRpcResult<CapTablePrivateTokenTransferResult>;

            console.log({ result });
            sendResponse(topic, {
                ...result,
                result: {
                    capTablePrivateTransferTokenVP:
                        result.result.capTablePrivateTokenTransferVP.proof.jwt,
                },
            });
        }
    }, [client]);
}
