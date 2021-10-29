// Third party
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

// Local
import { BankidWebview } from "../components/bankid/BankidWebview";
import { makeBankIDScreenResult } from "../types/ScreenResults";
import { useScreenRequest } from "../hooks/useScreenRequest";
import { useFromScreen } from "../hooks/useFromScreen";
import { ScreenRequest } from "../types/ScreenRequest";
import { BankIDParams } from "../types/paramTypes";

export function BankIDScreen(props: {
    route: { params: ScreenRequest<BankIDParams> };
}) {
    const fromScreen = useFromScreen(props.route.params);
    const [request] = useScreenRequest(props.route.params);
    const { navigate } = useNavigation();
    const [errors, setErrors] = useState<string[]>([]);
    const [bankIDToken, setBankidToken] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (!request) {
            return;
        }
        if (!fromScreen) {
            return;
        }
        if (!bankIDToken) {
            return;
        }

        const result = makeBankIDScreenResult(request, {
            bankIDToken,
        });

        navigate(fromScreen, result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request, fromScreen, bankIDToken]);

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
