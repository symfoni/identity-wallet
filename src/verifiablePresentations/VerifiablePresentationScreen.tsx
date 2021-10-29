// React
import React, { ReactNode, useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator, Text } from "react-native";
import { formatJsonRpcResult } from "@json-rpc-tools/utils";

// Third party
import styled from "styled-components/native";

// Local
import { useFromScreen } from "../hooks/useFromScreen";
import { useScreenRequest } from "../hooks/useScreenRequest";
import { useVerifiableCredentialCards } from "../verifiableCredentials/useVerifiableCredentialCards";
import { SupportedVerifiableCredential } from "../verifiableCredentials/SupportedVerifiableCredentials";
import { useSymfoniContext } from "../context";
import {
    BankIDResult,
    VerifiablePresentationResult,
} from "../types/resultTypes";
import { ScreenRequest } from "../types/ScreenRequest";
import { VerifiablePresentationParams } from "../types/paramTypes";
import { ScreenResult } from "../types/ScreenResults";

// Screen
export function VerifiablePresentationScreen(props: {
    route: {
        params?:
            | ScreenRequest<VerifiablePresentationParams>
            | ScreenResult<BankIDResult>;
    };
}) {
    const { createVP } = useSymfoniContext();
    const { navigate } = useNavigation();
    const fromScreen = useFromScreen(props.route.params);
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

    const onSignedVC = (signedVC: SupportedVerifiableCredential) => {
        console.log({ signedVC });

        setRequest((current) => {
            if (!current) {
                return undefined;
            }
            const foundIndex = current.params.verifiableCredentials.findIndex(
                (vc) => vc.type.join(",") === signedVC.type.join(",")
            );

            // Merge signed VC into existing array of vcs.. @TODO use a utility library for merging arrays instead?
            return {
                ...current,
                params: {
                    ...current.params,
                    verifiableCredentials: [
                        ...current.params.verifiableCredentials.splice(
                            0,
                            foundIndex
                        ),
                        signedVC,
                        ...current.params.verifiableCredentials.splice(
                            foundIndex + 1
                        ),
                    ],
                },
            };
        });
    };

    const cards = useVerifiableCredentialCards(
        verifiableCredentials,
        onSignedVC,
        props.route.params
    );

    useEffect(() => {
        console.log(
            "verifiablePresentationScreen.tsx: vcs.length: ",
            verifiableCredentials.length
        );
        console.log(
            "verifiablePresentationScreen.tsx: signedVcs.length: ",
            signedVerifiableCredentials.length
        );
    }, [signedVerifiableCredentials, verifiableCredentials]);

    const onPresent = async () => {
        if (!fromScreen) {
            console.warn("onPresent(): !fromScreen");
            return;
        }
        if (!request) {
            console.warn("onPresent(): !request");
            return;
        }
        if (request.params.verifiableCredentials.some((vc) => !vc.proof)) {
            console.warn(
                "onPresent(): request.params.verifiableCredentials.some((vc) => !vc.proof)"
            );
            return;
        }

        const vp = await createVP(
            request.params.verifier.id,
            request.params.verifiableCredentials
        );

        const result = formatJsonRpcResult<VerifiablePresentationResult>(
            request.id,
            { verifiablePresenation: vp }
        );

        navigate(fromScreen, result);
    };

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

function PresentButton({
    children,
    onPress,
}: {
    children: ReactNode;
    onPress: () => void;
}) {
    return (
        <PresentButtonView onPress={onPress}>
            <PresentButtonText>{children}</PresentButtonText>
        </PresentButtonView>
    );
}

const PresentButtonView = styled.TouchableOpacity`
    background-color: rgb(52, 199, 89);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 44px;
    margin-horizontal: 30px;
    margin-top: 20px;
    margin-bottom: 50px;
    border-radius: 10px;
    width: 200px;
    align-self: center;
`;
const PresentButtonText = styled.Text`
    color: rgb(255, 255, 255);
    font-weight: 500;
    font-size: 16px;
`;
