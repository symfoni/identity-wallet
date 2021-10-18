import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useRef, useState } from "react";


export const SCREEN_CREATE_CAP_TABLE_VP = "CreateCapTableVPScreen";

export function useNavigationWithResult<Result>(result?: JsonRpcResult<Result>) {
    const navigation = useNavigation();

    const resultMap = useRef(new Map<number, (result: JsonRpcResult<Result>) => void>())

    const getNavigationResultFrom = <Param>(from: string, request: JsonRpcRequest<Param>) => {
        navigation.navigate(from, request);
        
        console.info(`useNavigationResult(): Navigating to screen: ${from} with request.id: ${request.id}`);
        return new Promise<JsonRpcResult<Result>>(resolve => {
            resultMap.current.set(request.id, resolve);
        });
    }

    useEffect(() => {
        if (!result) return;
        console.info("useNavigationResult(): Got result with id: ", result.id);
        resultMap.current.get(result.id)?.(result);
    }, [result])

    return {
        getNavigationResultFrom,
    };
}