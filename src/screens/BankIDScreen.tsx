// Third party
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

// Local
import { BankidWebview } from "../components/bankid/BankidWebview";
import { makeBankIDScreenResult } from "../types/ScreenResults";
import { useScreenRequest } from "../hooks/useScreenRequest";
import { ScreenRequest } from "../types/ScreenRequest";
import { BankIDParams } from "../types/paramTypes";
import { useNavigateBack } from "../hooks/useNavigationWithResult";

export function BankIDScreen(props: {
    route: { params?: ScreenRequest<BankIDParams> };
}) {
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
