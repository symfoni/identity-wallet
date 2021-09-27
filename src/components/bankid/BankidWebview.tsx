import React, { useEffect, useState } from "react";
import WebView from "react-native-webview";
import {
    BANKID_CALLBACK_URL,
    BANKID_CLIENT_ID,
    BANKID_ACR_VALUES_MOBILE,
    BANKID_ACR_VALUES_WEB,
    BANKID_URL,
} from "@env";
import { StyleSheet, View } from "react-native";
import { URL } from "react-native-url-polyfill";
import { Button } from "../ui/button";

interface Props {
    onSuccess: (bankidToken: string) => void;
    onError: (reason: string) => void;
    bankidTarget: "web" | "mobile";
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

        if (!BANKID_ACR_VALUES_WEB) {
            throw Error("Please set BANKID_ACR_VALUES_WEB env variable");
        }
        if (!BANKID_ACR_VALUES_MOBILE) {
            throw Error("Please set BANKID_ACR_VALUES_MOBILE env variable");
        }
        if (!BANKID_URL) {
            throw Error("Please set BANKID_URL env variable");
        }

        const params: { [s: string]: string } = {
            response_type: "id_token",
            client_id: BANKID_CLIENT_ID,
            redirect_uri: BANKID_CALLBACK_URL,
            acr_values:
                props.bankidTarget === "mobile"
                    ? BANKID_ACR_VALUES_MOBILE
                    : BANKID_ACR_VALUES_WEB,
            scope: "openid",
            // response_mode: "fragment",
            // nonce: "ecnon",
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
        console.log(url);
        // return "https://blockchangers.criipto.id/oauth2/authorize?response_type=id_token&client_id=urn%3Amy%3Aapplication%3Aidentifier%3A8060&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fbankid&acr_values=urn%3Agrn%3Aauthn%3Ano%3Abankid%3Acentral&scope=openid";
        // return "https://blockchangers-prod.criipto.id/oauth2/authorize?client_id=urn:my:application:identifier:1519&acr_values=urn:grn:authn:no:bankid:central&redirect_uri=http://localhost:3001/bankid&scope=openid&response_type=id_token&response_mode=fragment&nonce=ecnon";
        return url;
    };

    const handleWebviewStateChange = (data: any) => {
        console.log(data.url);
        console.log("url" in data, data.url, typeof data.url === "string");
        if ("url" in data && data.url && typeof data.url === "string") {
            if (data.url.includes("id_token")) {
                let url = new URL(data.url);
                let id_token = url.searchParams.get("id_token");
                console.log(id_token);
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
    webview: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: "grey",
    },
});
