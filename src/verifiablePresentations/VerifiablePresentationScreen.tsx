import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { VerifiableCredential } from "@veramo/core";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { useScreenFromScreen } from "../hooks/useScreenFromScreen";
import { useScreenRequest } from "../hooks/useScreenRequest";
import { useScreenResult } from "../hooks/useScreenResult";
import { ScreenRequest } from "../types/ScreenRequest";
import { ScreenResult } from "../types/ScreenResult";

export function VerifiablePresentationScreen(props: {
    route: {
        params?:
            | ScreenRequest<VerifiablePresentationParams>
            | ScreenResult<any>; // @TODO change 'any' -> 'some types'
    };
}) {
    const { navigate } = useNavigation();
    const [fromScreen, setFromScreen] = useScreenFromScreen(props.route.params);
    const [request, setRequest] = useScreenRequest(props.route.params);
    const [result, setResult] = useScreenResult(props.route.params);

    return (
        <>
            <Text>Hei</Text>

            {fromScreen && (
                <Button title="Vis" onPress={() => navigate(fromScreen)} />
            )}
        </>
    );
}

export type VerifiablePresentationParams = {
    verifier: {
        id: string;
        name: string;
    };
    reason: { locale: "en" | "no"; text: string }[];
    verifiableCredential: VerifiableCredential[];
};
