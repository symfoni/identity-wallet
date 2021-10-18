import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";


export const SCREEN_CREATE_CAP_TABLE_VP = "CreateCapTableVPScreen";

export function useNavigationWithResult<Result>(result?: JsonRpcResult<Result>) {
    const navigation = useNavigation();

    const [resultMap, setResultMap] = useState<Map<number, (result: JsonRpcResult<Result>) => void>>(new Map);

    const getNavigationResultFrom = <Param>(screen: "CreateCapTableVPScreen", request: JsonRpcRequest<Param>) => {
        navigation.navigate(screen, request);

        console.info(`useNavigationResult(): Navigating to screen: ${screen} with request.id: ${request.id}`);
        return new Promise<JsonRpcResult<Result>>(resolve => {
            setResultMap(current => {
                const next = new Map(current);
                next.set(request.id, resolve);
                return next;
            })
        });
    }

    useEffect(() => {
        if (!result) return;
        console.info("useNavigationResult(): Got result with id: ", result.id);
        resultMap.get(result.id)?.(result);
    }, [result])

    return {
        getNavigationResultFrom,
    };
}