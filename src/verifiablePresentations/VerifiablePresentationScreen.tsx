import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import React from "react";
import { Text } from "react-native";
import { CapTablePrivateTokenTransferParams } from "../types/capTableTypes";
import { BankIDResult } from "../types/paramTypes";

export function VerifiablePresentationScreen(props: {
    route: {
        params?:
            | JsonRpcRequest<CapTablePrivateTokenTransferParams>
            | JsonRpcResult<BankIDResult>;
    };
}) {
    return <Text>Hei</Text>;
}
