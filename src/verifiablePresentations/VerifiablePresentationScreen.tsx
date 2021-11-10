// React
import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator, Button, Text } from "react-native";

// Third party
import styled from "styled-components/native";

// Local
import { useScreenRequest } from "../hooks/useScreenRequest";
import { useVerifiableCredentialCards } from "../verifiableCredentials/useVerifiableCredentialCards";
import { SupportedVerifiableCredential } from "../verifiableCredentials/SupportedVerifiableCredentials";
import { useSymfoniContext } from "../context";
import { BankIDResult } from "../types/resultTypes";
import { ScreenRequest } from "../types/ScreenRequest";
import { VerifiablePresentationParams } from "../types/paramTypes";
import {
    makeScreenError,
    makeVerifiablePresentationScreenResult,
    ScreenError,
    ScreenResult,
} from "../types/ScreenResults";
import { useNavigateBack } from "../hooks/useNavigationWithResult";
import { PresentButton } from "../components/PresentButton";

// Screen
export function VerifiablePresentationScreen(props: {
    route: {
        params?:
            | ScreenRequest<VerifiablePresentationParams>
            | ScreenResult<BankIDResult>
            | ScreenError;
    };
}) {
    const { createVP } = useSymfoniContext();
    const { setOptions } = useNavigation();
    const { navigateBack } = useNavigateBack(props.route.params);
    const [request, setRequest] = useScreenRequest(props.route.params);

    const verifiableCredentials = useMemo(
        () => request?.params.verifiableCredentials ?? [],
        [request]
    );
    const signedVerifiableCredentials = useMemo(
        () => verifiableCredentials.filter((vc) => vc.proof),
        [verifiableCredentials]
    );
    const presentable = useMemo(
        () =>
            verifiableCredentials.length === signedVerifiableCredentials.length,
        [verifiableCredentials, signedVerifiableCredentials]
    );

    /**
     * onSignedVC() - Update the list of VC, when a VC card has been signed.
     */
    const onSignedVC = (signedVC: SupportedVerifiableCredential) => {
        setRequest((current) => {
            if (!current) {
                return undefined;
            }
            const foundIndex = current.params.verifiableCredentials.findIndex(
                (vc) => vc.type.join(",") === signedVC.type.join(",")
            );

            const copy = [...current.params.verifiableCredentials];
            copy[foundIndex] = signedVC;

            return {
                ...current,
                params: {
                    ...current.params,
                    verifiableCredentials: copy,
                },
            };
        });
    };

    const cards = useVerifiableCredentialCards(
        verifiableCredentials,
        onSignedVC,
        props.route.params
    );

    /**
     * onPresent() - Navigate back with JsonRpcResult
     */
    const onPresent = useCallback(async () => {
        if (!request) {
            console.warn("onPresent(): !request");
            return;
        }
        if (!presentable) {
            console.warn("onPresent(): !presentable");
            return;
        }

        const vp = await createVP(
            request.params.verifier.id,
            request.params.verifiableCredentials
        );

        const result = makeVerifiablePresentationScreenResult(request, {
            // Only provide a plaintext vp for debugging - not in realease - because vp is redundant, since jwt contains the exact same information.
            vp: __DEV__ ? vp : undefined,
            jwt: vp.proof.jwt,
        });

        navigateBack(result);
    }, [request, presentable, createVP, navigateBack]);

    /**
     * onReject() - Navigate back with JsonRpcError
     */
    const onReject = useCallback(() => {
        if (!request) {
            console.warn("onReject(): ERROR !request");
            return;
        }
        const error = makeScreenError(request, {
            code: 1,
            message: "The user rejected the vp-request.",
        });

        navigateBack(error);
    }, [request, navigateBack]);

    /**
     * useEffect() - Configure headerLeft() and headerRight() buttons, and "beforeRemove"-event-listener.
     */
    useEffect(() => {
        setOptions({
            headerRight: () => (
                <Button
                    onPress={onReject}
                    title="Avbryt"
                    color="rgb(0,122, 255)"
                />
            ),
        });
    }, [request, presentable, onPresent, setOptions, onReject]);

    if (!request) {
        return (
            <>
                <Text>Loading request...</Text>
                <ActivityIndicator />
            </>
        );
    }

    return (
        <Screen>
            <Content>
                <SmallText>Til</SmallText>
                <BigText>{request.params.verifier.name}</BigText>

                <SmallText>For å kunne</SmallText>
                <BigText>{request.params.verifier.reason}</BigText>

                {cards}
            </Content>
            {presentable && (
                <PresentButton onPress={onPresent}>Vis</PresentButton>
            )}
        </Screen>
    );
}

const Screen = styled.ScrollView`
    height: 100%;
    background: white;
    border: 1px solid white;
`;
const Content = styled.View`
    flex: 1;
    padding-horizontal: 30px;
    padding-vertical: 30px;
`;
const SmallText = styled.Text`
    margin-left: 5px;
`;
const BigText = styled.Text`
    font-size: 22px;
    padding-bottom: 20px;
    margin-left: 5px;
`;
