// Third party
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    ActivityIndicator,
    Button,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAsyncEffect } from "use-async-effect";
import { SessionTypes } from "@walletconnect/types";

// Local
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
    AccessVPParams,
    CapTableClaimTokenParams,
    CapTablePrivateTokenTransferParams,
    CreateCapTableVPParams,
    UpdateShareholderVPParams,
} from "../types/paramTypes";
import { VerifiablePresentationResult } from "../types/resultTypes";
import { makeVerifiablePresentationScreenRequest } from "../types/ScreenRequest";
import { ScreenError, ScreenResult } from "../types/ScreenResults";
import { makeAccessVC } from "../verifiableCredentials/AccessVC";
import { makeCapTableClaimTokenVC } from "../verifiableCredentials/CapTableClaimTokenVC";
import { makeCapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { makeCapTableVC } from "../verifiableCredentials/CapTableVC";
import {
    makeNationalIdentityVC,
    NationalIdentityVC,
} from "../verifiableCredentials/NationalIdentityVC";
import {
    makeTermsOfUseForvaltVC,
    TermsOfUseForvaltVC,
} from "../verifiableCredentials/TermsOfUseVC";
import { makeCapTableUpdateShareholderVC } from "../verifiableCredentials/CapTableUpdateShareholderVC";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { SymfoniButton } from "../components/ui/button";

export const Home = (props: {
    route: {
        params?: ScreenResult<VerifiablePresentationResult> | ScreenError;
    };
}) => {
    const { pair, loading, closeSessions, closeSession, sessions } =
        useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);
    const [scannerVisible, setScannerVisible] = useState(
        __DEV__ ? false : true
    );

    // Sessions
    const onCloseSessions = useCallback(async () => {
        await Promise.all(closeSessions());
        setScannerVisible(true);
    }, [closeSessions]);

    // QR
    const onScanQR = useCallback(
        async (maybeURI: any) => {
            console.log("onRead", maybeURI);

            // 1. Validate URI
            if (typeof maybeURI !== "string") {
                console.info("typeof maybeURI !== 'string': ", maybeURI);
                return;
            }
            if (!maybeURI.startsWith("wc:")) {
                console.info("!maybeURI.startsWith('wc:'): ", maybeURI);
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
            setScannerVisible(false);
        },
        [pair]
    );

    useEffectAccessVP(props.route.params);
    useEffectCreateCapTableVP(props.route.params);
    useEffectCapTablePrivateTokenTransferVP(props.route.params);
    useEffectCapTableClaimUnclaimed(props.route.params);
    useEffectUpdateShareholderVP(props.route.params);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    {scannerVisible && <Scanner onInput={onScanQR} />}

                    <SymfoniButton
                        icon={"qr"}
                        type="primary"
                        text="Scan QR"
                        onPress={() => setScannerVisible(!scannerVisible)}
                    />
                </View>

                {!scannerVisible && sessions.length > 0 && (
                    <View style={styles.actionContainer}>
                        <Text>Du har {sessions.length} aktiv tilkobling</Text>
                        <Button title={`Koble fra`} onPress={onCloseSessions} />
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
            margin: 10,
        },
    });
};

/**
 * useEffectCreateCapTableVP()
 */
function useEffectCreateCapTableVP(
    screenParams?: ScreenResult<VerifiablePresentationResult> | ScreenError
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(screenParams);

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
                    makeTermsOfUseForvaltVC().type
                )) as TermsOfUseForvaltVC) ?? makeTermsOfUseForvaltVC();

            const nationalIdentityVC =
                ((await findVCByType(
                    makeNationalIdentityVC().type
                )) as NationalIdentityVC) ?? makeNationalIdentityVC();

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
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            const navigationResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            sendResponse(
                topic,
                navigationResult.result ?? navigationResult.error
            );
        }
    }, [client]);
}

/**
 * useEffectCapTablePrivateTokenTransferVP()
 */
function useEffectCapTablePrivateTokenTransferVP(
    screenParams?: ScreenResult<VerifiablePresentationResult> | ScreenError
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(screenParams);

    useAsyncEffect(async () => {
        while (client) {
            // 1. Listen for event
            const { topic, request } = await consumeEvent(
                "symfoniID_capTablePrivateTokenTransferVP"
            );
            console.info("consumed symfoniID_capTablePrivateTokenTransferVP:", {
                request,
            });

            // 2. Get existing VCs if exist.
            const params = request
                .params[0] as CapTablePrivateTokenTransferParams;

            const termsOfUseForvaltVC =
                ((await findVCByType(
                    makeTermsOfUseForvaltVC().type
                )) as TermsOfUseForvaltVC) ?? makeTermsOfUseForvaltVC();

            const nationalIdentityVC =
                ((await findVCByType(
                    makeNationalIdentityVC().type
                )) as NationalIdentityVC) ?? makeNationalIdentityVC();

            // 3. Make screen request
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
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            // 4. Navigate and wait for result
            const screenResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            // 5. Send response
            sendResponse(topic, screenResult.result ?? screenResult.error);
        }
    }, [client]);
}

function useEffectCapTableClaimUnclaimed(
    screenParams?: ScreenResult<VerifiablePresentationResult> | ScreenError
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(screenParams);

    useAsyncEffect(async () => {
        while (client) {
            // 1. Listen for event
            const { topic, request } = await consumeEvent(
                "symfoniID_capTableClaimToken"
            );
            console.info("consumed symfoniID_capTableClaimToken", {
                request,
            });

            const params = request.params[0] as CapTableClaimTokenParams;

            const nationalIdentityVC =
                ((await findVCByType(
                    makeNationalIdentityVC().type
                )) as NationalIdentityVC) ?? makeNationalIdentityVC();

            // 3. Make screen request
            const screenRequest = makeVerifiablePresentationScreenRequest(
                SCREEN_HOME,
                NAVIGATOR_TABS,
                request.method,
                {
                    verifier: {
                        id: params.verifier,
                        name: params.verifier,
                        reason: "Gjør krav på aksjer",
                    },
                    verifiableCredentials: [
                        makeCapTableClaimTokenVC(params.claimTokens),
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            // 4. Navigate and wait for result
            const screenResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            // 5. Send response
            sendResponse(topic, screenResult.result ?? screenResult.error);
        }
    }, [client]);
}

/**
 * useEffectAccessVP()
 */
function useEffectAccessVP(
    screenParams?: ScreenResult<VerifiablePresentationResult> | ScreenError
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(screenParams);

    useAsyncEffect(async () => {
        while (client) {
            // 1. Listen for event
            const { topic, request } = await consumeEvent("symfoniID_accessVP");
            console.info("consumed symfoniID_accessVP:", {
                request,
            });

            // 2. Get existing VCs if exist.
            const params = request.params[0] as AccessVPParams;

            const nationalIdentityVC =
                ((await findVCByType(
                    makeNationalIdentityVC().type
                )) as NationalIdentityVC) ?? makeNationalIdentityVC();

            // 3. Make screen request
            const screenRequest = makeVerifiablePresentationScreenRequest(
                SCREEN_HOME,
                NAVIGATOR_TABS,
                request.method,
                {
                    verifier: {
                        id: params.verifier,
                        name: params.verifier,
                        reason: "Dele dine data",
                    },
                    verifiableCredentials: [
                        makeAccessVC({
                            delegatedTo: params.access.delegatedTo,
                            scopes: params.access.scopes,
                        }),
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            // 4. Navigate and wait for result
            const screenResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            console.log({ screenResult });
            // 5. Send response
            sendResponse(topic, screenResult.result ?? screenResult.error);
        }
    }, [client]);
}

/**
 * useEffectUpdateShareholder()
 */
function useEffectUpdateShareholderVP(
    result?: ScreenResult<VerifiablePresentationResult> | ScreenError
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(result);

    useAsyncEffect(async () => {
        while (client) {
            // 1. Listen for event
            const { topic, request } = await consumeEvent(
                "symfoniID_updateShareholderVP"
            );
            console.info("consumed symfoniID_updateShareholderVP:", {
                request,
            });

            // 2. Get existing VCs if exist.
            const params = request.params[0] as UpdateShareholderVPParams;

            const nationalIdentityVC =
                ((await findVCByType(
                    makeNationalIdentityVC().type
                )) as NationalIdentityVC) ?? makeNationalIdentityVC();

            // 3. Make screen request
            const screenRequest = makeVerifiablePresentationScreenRequest(
                SCREEN_HOME,
                NAVIGATOR_TABS,
                request.method,
                {
                    verifier: {
                        id: params.verifier,
                        name: params.verifier,
                        reason: "Dele dine data",
                    },
                    verifiableCredentials: [
                        makeCapTableUpdateShareholderVC(
                            params.updateShareholderVC.credentialSubject
                                .shareholderId,
                            params.updateShareholderVC.credentialSubject
                                .capTableAddress,
                            params.updateShareholderVC.credentialSubject
                                .shareholderData
                        ),
                        nationalIdentityVC,
                    ],
                },
                request.id
            );

            // 4. Navigate and wait for result
            const screenResult = await navigateWithResult(
                SCREEN_VERIFIABLE_PRESENTATION,
                screenRequest
            );

            console.log({ screenResult });
            // 5. Send response
            sendResponse(topic, screenResult.result ?? screenResult.error);
        }
    }, [client]);
}
