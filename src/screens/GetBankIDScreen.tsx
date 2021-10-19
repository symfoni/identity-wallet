import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";
import { BankidWebview } from "../components/bankid/BankidWebview";
import { ParamBankIDToken } from "../types/paramTypes";

export function GetBankIDScreen(props: {
    route: { params: { id: number; resultScreen: string } };
}) {
    console.debug("GetBankIDScreen: ", { props });

    const { navigate } = useNavigation();
    const [errors, setErrors] = useState<string[]>([]);
    const [bankIDToken, setBankidToken] = useState<string | null>(null);

    useEffect(() => {
        if (bankIDToken !== null) {
            navigate(props.route.params.resultScreen, {
                id: props.route.params.id,
                method: "PARAM_BANKID_TOKEN",

                params: { bankIDToken },
            } as ParamBankIDToken);
        }
    }, [bankIDToken, navigate, props.route.params]);

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
