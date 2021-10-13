import React, { useEffect } from "react";
import WebView from "react-native-webview";
import {
    BANKID_CALLBACK_URL,
    BANKID_CLIENT_ID,
    BANKID_ACR_VALUES,
    BANKID_URL,
} from "@env";
import { StyleSheet } from "react-native";
import { URL } from "react-native-url-polyfill";

interface Props {
    onSuccess: (bankidToken: string) => void;
    onError: (reason: string) => void;
}

export const BankidWebview: React.FC<Props> = ({ ...props }) => {
    useEffect(() => {
        console.log("Fnr", `11126138727`);
        console.log("Fnr", `14102123973`);
        console.log("Fnr", `26090286144`);
        console.log("Fnr", `09050319935`, "Jon");
        console.log("Fnr", `17107292926`, "Roberto");
        console.log("One - time password", `otp`);
        console.log("Personal password", `qwer1234`);
    }, []);

    const bankidLoginURL = () => {
        if (!BANKID_CALLBACK_URL) {
            throw Error("Please set BANKID_CALLBACK_URL env variable");
        }
        if (!BANKID_CLIENT_ID) {
            throw Error("Please set BANKID_CLIENT_ID env variable");
        }
        if (!BANKID_ACR_VALUES) {
            throw Error("Please set BANKID_ACR_VALUES env variable");
        }
        if (!BANKID_URL) {
            throw Error("Please set BANKID_URL env variable");
        }
        const params: { [s: string]: string } = {
            response_type: "id_token",
            client_id: BANKID_CLIENT_ID,
            redirect_uri: BANKID_CALLBACK_URL,
            acr_values: BANKID_ACR_VALUES,
            scope: "openid",
        };
        const queryString = Object.keys(params)
            .map((key) => {
                return (
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(params[key])
                );
            })
            .join("&");
        const url = BANKID_URL + queryString;
        return url;
    };

    const handleWebviewStateChange = (data: any) => {
        if (data.url && typeof data.url === "string") {
            if (data.url.includes("id_token")) {
                let url = new URL(data.url);
                let id_token = url.searchParams.get("id_token");
                if (typeof id_token === "string") {
                    console.log("id_token =>", id_token);
                    props.onSuccess(id_token);
                    return;
                }
                //props.onError("ERROR handling not implemented"); // TODO Fix error handling
            }
        }
    };

    return (
        <WebView
            source={{ uri: bankidLoginURL() }}
            style={styles.webview}
            onMessage={(event) =>
                console.log("onMessage", event.nativeEvent.data)
            }
            onNavigationStateChange={(data) => handleWebviewStateChange(data)}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "teal",
        minHeight: 200,
        flex: 1,
    },
    webview: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: "grey",
    },
});
