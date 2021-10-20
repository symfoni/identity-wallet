import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useRef } from "react";

export function useNavigationWithResult<Result>(
    result?: JsonRpcResult<Result>
) {
    const navigation = useNavigation();

    const resultMap = useRef(
        new Map<number, (result: JsonRpcResult<Result>) => void>()
    );

    const navigateWithResult = <Param>(
        toScreen: string,
        request: JsonRpcRequest<Param>
    ) => {
        console.info(
            `useNavigationResult(): Navigating to screen: ${toScreen} with request.id: ${request.id}`
        );
        navigation.navigate(toScreen, request);

        return new Promise<JsonRpcResult<Result>>((resolve) => {
            resultMap.current.set(request.id, resolve);
        });
    };

    useEffect(() => {
        if (!result) {
            return;
        }
        console.info(
            "useNavigationResult(): Got result with --------------------------------- request.id: ",
            result.id
        );
        resultMap.current.get(result.id)?.(result);
        resultMap.current.delete(result.id);
    }, [result]);

    return {
        navigateWithResult,
    };
}
