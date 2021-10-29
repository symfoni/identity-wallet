import { JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useRef } from "react";
import { ScreenRequest } from "../types/ScreenRequest";

export function useNavigationWithResult<Result extends JsonRpcResult<any>>(
    result?: Result
) {
    const navigation = useNavigation();
    const navigationResults = useRef(
        new Map<number, (result: JsonRpcResult<any>) => void>()
    );

    const navigateWithResult = <Param>(
        toScreen: string,
        screenRequest: ScreenRequest<Param>
    ) => {
        console.info(
            `useNavigationResult(): Navigating toScreen: ${toScreen}, fromScreen: ${screenRequest.fromScreen}, with request.id: ${screenRequest.request.id}`
        );
        navigation.navigate(toScreen, screenRequest);

        return new Promise<Result>((resolve) => {
            navigationResults.current.set(
                screenRequest.request.id,
                resolve as (value: JsonRpcResult<any>) => void
            );
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
        navigationResults.current.get(result.id)?.(result);
        navigationResults.current.delete(result.id);
    }, [result, navigationResults]);

    return {
        navigateWithResult,
    };
}
