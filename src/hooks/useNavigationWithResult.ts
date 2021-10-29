import { JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useRef } from "react";
import { ScreenRequest } from "../types/ScreenRequest";

const ref = new Map<number, (result: JsonRpcResult<any>) => void>();

export function useNavigationWithResult<Result extends JsonRpcResult<any>>(
    result?: Result
) {
    const navigation = useNavigation();
    const navigationResults = useRef(ref);

    const navigateWithResult = <Param>(
        toScreen: string,
        screenRequest: ScreenRequest<Param>
    ) => {
        console.info(
            `useNavigationResult():  Navigating with --------------------------------- request.id: ${screenRequest.request.id}`,
            { screenRequest }
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
            result.id,
            result
        );
        const resolve = navigationResults.current.get(result.id);
        if (!resolve) {
            console.info("useNavigationResult(): !resolve ", result.id);
            return;
        }
        resolve(result);
        navigationResults.current.delete(result.id);
    }, [result, navigationResults]);

    return {
        navigateWithResult,
    };
}
