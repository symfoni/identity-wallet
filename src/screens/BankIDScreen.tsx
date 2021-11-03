// Third party
import React, { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

// Local
import { BankidWebview } from "../components/bankid/BankidWebview";
import {
    makeBankIDScreenResult,
    makeScreenError,
    makeVerifiablePresentationScreenError,
} from "../types/ScreenResults";
import { useScreenRequest } from "../hooks/useScreenRequest";
import { ScreenRequest } from "../types/ScreenRequest";
import { BankIDParams } from "../types/paramTypes";
import { useNavigateBack } from "../hooks/useNavigationWithResult";
import { useNavigation } from "@react-navigation/core";
import { Button } from "react-native";

export function BankIDScreen(props: {
    route: { params?: ScreenRequest<BankIDParams> };
}) {
    const { setOptions } = useNavigation();
    const { navigateBack } = useNavigateBack(props.route.params);
    const [request] = useScreenRequest(props.route.params);
    const [errors, setErrors] = useState<string[]>([]);
    const [bankIDToken, setBankidToken] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (!request) {
            console.info("BankIDScreen.tsx: !request");
            return;
        }

        if (!bankIDToken) {
            console.info("BankIDScreen.tsx: !bankIDToken");
            return;
        }

        const screenResult = makeBankIDScreenResult(request, {
            bankIDToken,
        });

        navigateBack(screenResult);
    }, [request, bankIDToken, navigateBack]);

    /**
     * onReject() - Navigate back with JsonRpcError
     */
    const onReject = useCallback(() => {
        if (!request) {
            console.warn("onReject(): ERROR !request");
            return;
        }
        const error = makeScreenError(request, {
            code: 2,
            message: "The user rejected the bankID request.",
        });

        navigateBack(error);
    }, [request, navigateBack]);

    /**
     * useEffect() - Configure headerLeft()
     */
    useEffect(() => {
        setOptions({
            headerLeft: () => (
                <Button
                    onPress={onReject}
                    title="Avbryt"
                    color="rgb(0,122, 255)"
                />
            ),
        });
    }, [request, setOptions, onReject]);

    useEffect(() => {
        if (errors.length > 0) {
            Toast.show({
                type: "error",
                text1: "Something went wrong",
                text2: errors.join(","),
                topOffset: 100,
                position: "top",
            });
            setErrors([]);
        }
    }, [errors]);

    return (
        <Screen>
            <BankidWebview
                onSuccess={setBankidToken}
                onError={(error) => {
                    setErrors((old) => [...old, error]);
                    console.log("BankidWebview", error);
                }}
            />
        </Screen>
    );
}

const Screen = styled.View`
    height: 100%;
    background-color: rgb(229, 229, 234);
`;
