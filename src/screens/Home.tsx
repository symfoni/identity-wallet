import { JsonRpcResult } from "@json-rpc-tools/types";
import React, { useContext } from "react";
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
    NAVIGATOR_TABS,
    SCREEN_HOME,
    SCREEN_VERIFIABLE_PRESENTATION,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import {
    CapTablePrivateTokenTransferParams,
    CreateCapTableVPParams,
} from "../types/capTableTypes";
import { VerifiablePresentationResult } from "../types/resultTypes";
import { makeVerifiablePresentationScreenRequest } from "../types/ScreenRequest";
import { ScreenResult } from "../types/ScreenResults";
import { makeCapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { makeCapTableVC } from "../verifiableCredentials/CapTableVC";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import {
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
} from "../verifiableCredentials/TermsOfUseVC";

export const Home = (props: {
    route: {
        params?: ScreenResult<VerifiablePresentationResult>;
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

    useEffectCreateCapTableVP(props.route.params?.result);
    useEffectCreateCapTablePrivateTokenTransferVP(props.route.params?.result);

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
    result?: JsonRpcResult<VerifiablePresentationResult>
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(result);

    useAsyncEffect(async () => {
        while (client) {
            const { topic, request } = await consumeEvent(
                "symfoniID_createCapTableVP"
            );

            // Get existing VCs if exist.
            const params = request.params[0] as CreateCapTableVPParams;

            console.log("consumed symfoniID_createCapTableVP:", { request });

            const termsOfUseForvaltVC =
                ((await findVCByType(
                    TODO_TermsOfUseForvaltVC.type
                )) as TermsOfUseForvaltVC) ?? TODO_TermsOfUseForvaltVC;

            const termsOfUseSymfoniVC =
                ((await findVCByType(
                    TODO_TermsOfUseSymfoniVC.type
                )) as TermsOfUseSymfoniVC) ?? TODO_TermsOfUseSymfoniVC;

            const nationalIdentityVC =
                ((await findVCByType(
                    TODO_NationalIdentityVC.type
                )) as NationalIdentityVC) ?? TODO_NationalIdentityVC;

            const screenRequest = makeVerifiablePresentationScreenRequest(
                SCREEN_HOME,
                NAVIGATOR_TABS,
                request.method,
                {
                    verifier: {
                        id: params.verifier,
                        name: params.verifier,
                        reason: "Opprette aksjeeierbok",
                    },
                    verifiableCredentials: [
                        makeCapTableVC(params.capTable),
                        termsOfUseForvaltVC,
                        termsOfUseSymfoniVC,
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            const navigationResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            sendResponse(topic, {
                ...navigationResult,
                result: {
                    ...navigationResult.result,
                    createCapTableVP:
                        navigationResult.result.verifiablePresenation.proof.jwt,
                },
            });
        }
    }, [client]);
}

/**
 * Listen, navigate, get navigation result and send response
 */
function useEffectCreateCapTablePrivateTokenTransferVP(
    result?: JsonRpcResult<VerifiablePresentationResult>
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(result);

    useAsyncEffect(async () => {
        while (client) {
            const { topic, request } = await consumeEvent(
                "symfoniID_capTablePrivateTokenTransferVP"
            );
            console.info("consumed symfoniID_capTablePrivateTokenTransferVP:", {
                request,
            });

            // Get existing VCs if exist.
            // TODO get correct terms of use
            const params = request
                .params[0] as CapTablePrivateTokenTransferParams;

            const termsOfUseForvaltVC =
                ((await findVCByType(
                    TODO_TermsOfUseForvaltVC.type
                )) as TermsOfUseForvaltVC) ?? TODO_TermsOfUseForvaltVC;

            const termsOfUseSymfoniVC =
                ((await findVCByType(
                    TODO_TermsOfUseSymfoniVC.type
                )) as TermsOfUseSymfoniVC) ?? TODO_TermsOfUseSymfoniVC;

            const nationalIdentityVC =
                ((await findVCByType(
                    TODO_NationalIdentityVC.type
                )) as NationalIdentityVC) ?? TODO_NationalIdentityVC;

            const screenRequest = makeVerifiablePresentationScreenRequest(
                SCREEN_HOME,
                NAVIGATOR_TABS,
                request.method,
                {
                    verifier: {
                        id: params.verifier,
                        name: params.verifier,
                        reason: "Overføre aksjer",
                    },
                    verifiableCredentials: [
                        makeCapTablePrivateTokenTransferVC(
                            params.toShareholder
                        ),
                        termsOfUseForvaltVC,
                        termsOfUseSymfoniVC,
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            const navigationResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            console.log({ navigationResult });
            sendResponse(topic, {
                ...navigationResult,
                result: {
                    capTablePrivateTransferTokenVP:
                        navigationResult.result.verifiablePresenation.proof.jwt,
                },
            });
        }
    }, [client]);
}

/**
 * @TODO Prefix with TODO_, because these objects should really be provided by the verifier. TODO is to move these objects to Forvalt.
 * Should be dynamically provided, and not hardcoded here.
 */
const TODO_NationalIdentityVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "NationalIdentityVC"],
} as NationalIdentityVC;

const TODO_TermsOfUseForvaltVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseForvaltVC"],
    credentialSubject: {
        readAndAccepted: {
            id: "https://forvalt.no/TOA",
        },
    },
} as TermsOfUseForvaltVC;

const TODO_TermsOfUseSymfoniVC = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.symfoni.id/credentials/v1",
    ],
    type: ["VerifiableCredential", "TermsOfUseVC", "TermsOfUseSymfoniVC"],
    credentialSubject: {
        readAndAccepted: {
            id: "https://symfoni.id/TOA",
        },
    },
} as TermsOfUseSymfoniVC;
