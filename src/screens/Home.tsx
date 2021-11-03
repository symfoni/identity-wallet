// Third party
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
    makeTermsOfUseSymfoniVC,
    TermsOfUseForvaltVC,
    TermsOfUseSymfoniVC,
} from "../verifiableCredentials/TermsOfUseVC";
import { makeCapTableUpdateShareholderVC } from "../verifiableCredentials/CapTableUpdateShareholderVC";

export const Home = (props: {
    route: {
        params?: ScreenResult<VerifiablePresentationResult> | ScreenError;
    };
}) => {
    const { pair, loading } = useSymfoniContext();
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);

    async function onScanQR(maybeURI: any) {
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
    }

    useEffectAccessVP(props.route.params);
    useEffectCreateCapTableVP(props.route.params);
    useEffectCapTablePrivateTokenTransferVP(props.route.params);
    useEffectCapTableClaimUnclaimed(props.route.params);
    useEffectUpdateShareholderVP(props.route.params);

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

            const termsOfUseSymfoniVC =
                ((await findVCByType(
                    makeTermsOfUseSymfoniVC().type
                )) as TermsOfUseSymfoniVC) ?? makeTermsOfUseSymfoniVC();

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

            const termsOfUseSymfoniVC =
                ((await findVCByType(
                    makeTermsOfUseSymfoniVC().type
                )) as TermsOfUseSymfoniVC) ?? makeTermsOfUseSymfoniVC();

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
                        termsOfUseSymfoniVC,
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
