// Third party
import React, { useCallback, useState } from "react";
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
// Local
import { ColorSystem, useColorContext } from "../colorContext";
import { Scanner } from "../components/scanner";
import { SymfoniButton } from "../components/ui/button";
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
import { makeCapTableUpdateShareholderVC } from "../verifiableCredentials/CapTableUpdateShareholderVC";
import { makeCapTableVC } from "../verifiableCredentials/CapTableVC";
import {
    makeNationalIdentityVC,
    NationalIdentityVC,
} from "../verifiableCredentials/NationalIdentityVC";
import {
    makeTermsOfUseForvaltVC,
    TermsOfUseForvaltVC,
} from "../verifiableCredentials/TermsOfUseVC";

export const Home = (props: {
    route: {
        params?: ScreenResult<VerifiablePresentationResult> | ScreenError;
    };
}) => {
    const { pair, loading, closeSessions, sessions } = useSymfoniContext();
    const { colors } = useColorContext();
    const styles = makeStyles(colors);
    const [scannerVisible, setScannerVisible] = useState(
        __DEV__ ? false : true
    );

    // Sessions
    const onCloseSessions = useCallback(async () => {
        await Promise.all(closeSessions());
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
                consoleWarnHome("onScanQR", "await pair(URI): ", err);
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
                {scannerVisible && <Scanner onInput={onScanQR} />}
                <View style={styles.actionContainer}>
                    <SymfoniButton
                        icon={"qr"}
                        type="primary"
                        text={scannerVisible ? "Lukk QR" : "Scan QR"}
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
            marginBottom: 30,
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

    useAsyncEffect(
        async (isMounted) => {
            while (client) {
                const { topic, request } = await consumeEvent(
                    "symfoniID_createCapTableVP"
                );
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCreateCapTableVP",
                        "!isMounted() 1"
                    );
                    return;
                }

                // Get existing VCs if exist.
                const params = request.params[0] as CreateCapTableVPParams;
                console.log("consumed symfoniID_createCapTableVP:", {
                    request,
                });

                let termsOfUseForvaltVC = makeTermsOfUseForvaltVC();
                try {
                    termsOfUseForvaltVC =
                        ((await findVCByType(
                            makeTermsOfUseForvaltVC().type
                        )) as TermsOfUseForvaltVC) ?? makeTermsOfUseForvaltVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectCreateCapTableVP",
                        "await findVCByType(makeTermsOfUseForvaltVC().type",
                        err
                    );
                    continue;
                }

                let nationalIdentityVC = makeNationalIdentityVC();
                try {
                    nationalIdentityVC =
                        ((await findVCByType(
                            makeNationalIdentityVC().type
                        )) as NationalIdentityVC) ?? makeNationalIdentityVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectCreateCapTableVP",
                        "await findVCByType(makeNationalIdentityVC().type)",
                        err
                    );
                }
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCreateCapTableVP",
                        "!isMounted() 2"
                    );
                    return;
                }

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
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCreateCapTableVP",
                        "!isMounted() 3"
                    );
                    return;
                }

                sendResponse(
                    topic,
                    navigationResult.result ?? navigationResult.error
                );
            }
        },
        [client]
    );
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

    useAsyncEffect(
        async (isMounted) => {
            while (client) {
                // 1. Listen for event
                const { topic, request } = await consumeEvent(
                    "symfoniID_capTablePrivateTokenTransferVP"
                );
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCapTablePrivateTokenTransferVP",
                        "!isMounted() 1"
                    );
                    return;
                }
                console.info(
                    "consumed symfoniID_capTablePrivateTokenTransferVP:",
                    {
                        request,
                    }
                );

                // 2. Get VCs if exist.
                const params = request
                    .params[0] as CapTablePrivateTokenTransferParams;

                let termsOfUseForvaltVC = makeTermsOfUseForvaltVC();
                try {
                    termsOfUseForvaltVC =
                        ((await findVCByType(
                            makeTermsOfUseForvaltVC().type
                        )) as TermsOfUseForvaltVC) ?? makeTermsOfUseForvaltVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectCapTablePrivateTokenTransferVP",
                        "await findVCByType(makeTermsOfUseForvaltVC().type)",
                        err
                    );
                    continue;
                }

                let nationalIdentityVC = makeNationalIdentityVC();
                try {
                    nationalIdentityVC =
                        ((await findVCByType(
                            makeNationalIdentityVC().type
                        )) as NationalIdentityVC) ?? makeNationalIdentityVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectCapTablePrivateTokenTransferVP",
                        "await findVCByType(makeNationalIdentityVC().type)",
                        err
                    );
                }
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCapTablePrivateTokenTransferVP",
                        "!isMounted() 2"
                    );
                    return;
                }

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
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCapTablePrivateTokenTransferVP",
                        "!isMounted() 3"
                    );
                    return;
                }

                // 5. Send response
                sendResponse(topic, screenResult.result ?? screenResult.error);
            }
        },
        [client]
    );
}

function useEffectCapTableClaimUnclaimed(
    screenParams?: ScreenResult<VerifiablePresentationResult> | ScreenError
) {
    const { consumeEvent, findVCByType, sendResponse, client } =
        useSymfoniContext();

    const { navigateWithResult } = useNavigationWithResult(screenParams);

    useAsyncEffect(
        async (isMounted) => {
            while (client) {
                // 1. Listen for event
                const { topic, request } = await consumeEvent(
                    "symfoniID_capTableClaimToken"
                );
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCapTableClaimUnclaimed",
                        "!isMounted() 1"
                    );
                    return;
                }
                console.info("consumed symfoniID_capTableClaimToken", {
                    request,
                });

                const params = request.params[0] as CapTableClaimTokenParams;

                let nationalIdentityVC = makeNationalIdentityVC();
                try {
                    nationalIdentityVC =
                        ((await findVCByType(
                            makeNationalIdentityVC().type
                        )) as NationalIdentityVC) ?? makeNationalIdentityVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectCapTableClaimUnclaimed",
                        "await findVCByType(makeNationalIdentityVC().type)",
                        err
                    );
                }
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCapTableClaimUnclaimed",
                        "!isMounted() 2"
                    );
                    return;
                }

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
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectCapTableClaimUnclaimed",
                        "!isMounted() 3"
                    );
                    return;
                }

                // 5. Send response
                sendResponse(topic, screenResult.result ?? screenResult.error);
            }
        },
        [client]
    );
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

    useAsyncEffect(
        async (isMounted) => {
            while (client) {
                // 1. Listen for event
                const { topic, request } = await consumeEvent(
                    "symfoniID_accessVP"
                );
                if (!isMounted()) {
                    consoleWarnHome("useEffectAccessVP", "!isMounted() 1");
                    return;
                }

                console.info("consumed symfoniID_accessVP:", {
                    request,
                });

                // 2. Get existing VCs if exist.
                const params = request.params[0] as AccessVPParams;

                let nationalIdentityVC = makeNationalIdentityVC();
                try {
                    nationalIdentityVC =
                        ((await findVCByType(
                            makeNationalIdentityVC().type
                        )) as NationalIdentityVC) ?? makeNationalIdentityVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectAccessVP",
                        "await findVCByType(makeNationalIdentityVC().type)",
                        err
                    );
                }
                if (!isMounted()) {
                    consoleWarnHome("useEffectAccessVP", "!isMounted() 2");
                    return;
                }

                // 3. Make screen request
                const screenRequest = makeVerifiablePresentationScreenRequest(
                    SCREEN_HOME,
                    NAVIGATOR_TABS,
                    request.method,
                    {
                        verifier: {
                            id: params.verifier,
                            name: "Brønnøysundregistrene Aksjeeierbok",
                            reason: "Hente dine aksjer",
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
                if (!isMounted()) {
                    consoleWarnHome("useEffectAccessVP", "!isMounted() 3");
                    return;
                }

                console.log({ screenResult });
                // 5. Send response
                sendResponse(topic, screenResult.result ?? screenResult.error);
            }
        },
        [client]
    );
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

    useAsyncEffect(
        async (isMounted) => {
            while (client) {
                // 1. Listen for event
                const { topic, request } = await consumeEvent(
                    "symfoniID_updateShareholderVP"
                );
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectUpdateShareholderVP",
                        "!isMounted() 1"
                    );
                    return;
                }

                console.info("consumed symfoniID_updateShareholderVP:", {
                    request,
                });

                // 2. Get existing VCs if exist.
                const params = request.params[0] as UpdateShareholderVPParams;

                let nationalIdentityVC = makeNationalIdentityVC();
                try {
                    nationalIdentityVC =
                        ((await findVCByType(
                            makeNationalIdentityVC().type
                        )) as NationalIdentityVC) ?? makeNationalIdentityVC();
                } catch (err) {
                    consoleWarnHome(
                        "useEffectUpdateShareholderVP",
                        "await findVCByType(makeNationalIdentityVC().type)",
                        err
                    );
                }
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectUpdateShareholderVP",
                        "!isMounted() 2"
                    );
                    return;
                }

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
                                params.shareholderId,
                                params.capTableAddress,
                                params.shareholderData
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
                if (!isMounted()) {
                    consoleWarnHome(
                        "useEffectUpdateShareholderVP",
                        "!isMounted() 3"
                    );
                    return;
                }
                console.log({ screenResult });
                // 5. Send response
                sendResponse(topic, screenResult.result ?? screenResult.error);
            }
        },
        [client]
    );
}

function consoleWarnHome(functionName: string, ...things: any[]) {
    console.warn(`ERROR Home.tsx: ${functionName}:`, ...things);
}
