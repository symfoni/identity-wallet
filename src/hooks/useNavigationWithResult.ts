import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useRef, useState } from "react";
import { BankIDResult } from "../types/resultTypes";
import { BankIDScreenRequest, ScreenRequest } from "../types/ScreenRequest";
import { BankIDScreenResult, ScreenResult } from "../types/ScreenResults";
import { SCREEN_BANKID } from "./useLocalNavigation";

export function useNavigationWithResult<Result>(
    result?: JsonRpcResult<Result>
) {
    const navigation = useNavigation();

    const resultMap = useRef(
        new Map<number, (result: JsonRpcResult<Result>) => void>()
    );

    const navigateWithResult = <Param>(
        toScreen: string,
        fromScreen: string,
        request: JsonRpcRequest<Param>
    ) => {
        console.info(
            `useNavigationResult(): Navigating toScreen: ${toScreen}, fromScreen: ${fromScreen}, with request.id: ${request.id}`
        );
        navigation.navigate(toScreen, { fromScreen, request });

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

export function useNavigateBankIDWithResult(
    result?: JsonRpcResult<BankIDResult>
) {
    const navigation = useNavigation();

    const [resultPromise, setResultPromise] = useState<
        ((result: BankIDResult) => void) | undefined
    >(undefined);

    const navigateBankIDWithResult = (screenRequest: BankIDScreenRequest) => {
        console.info(
            `useNavigationResult(): Navigating toScreen: ${SCREEN_BANKID}, fromScreen: ${screenRequest.fromScreen}, with request.id: ${screenRequest.request.id}`
        );
        navigation.navigate(SCREEN_BANKID, screenRequest);

        return new Promise<BankIDResult>((resolve) => {
            setResultPromise(resolve);
        });
    };

    useEffect(() => {
        if (!result) {
            return;
        }
        if (!resultPromise) {
            console.warn("ERROR useNavigateBankIDWithResult: !resultPromise");
            return;
        }

        console.info(
            "useNavigationResult(): Got result with --------------------------------- request.id: ",
            result.id
        );
        resultPromise?.(result.result);
        setResultPromise(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result]);

    return {
        navigateBankIDWithResult,
    };
}
