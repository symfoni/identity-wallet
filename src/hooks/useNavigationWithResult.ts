import { useNavigation } from "@react-navigation/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScreenRequest } from "../types/ScreenRequest";
import { ScreenError, ScreenResult } from "../types/ScreenResults";

type ResolverType = (result: ScreenResult<any> | ScreenError) => void;
const ref = new Map<number, ResolverType>();

/**
 * useNavigationWithResult() - Use this hook to navigate to a screen, which will eventually navigate back to you using useNavigateBack()
 */
export function useNavigationWithResult(
    screenResult?: ScreenResult<any> | ScreenError
) {
    const navigation = useNavigation();
    const navigationResults = useRef(ref);

    const navigateWithResult = (
        toScreen: string,
        screenRequest: ScreenRequest<any>
    ) => {
        console.info(
            `useNavigationResult():  Navigating with --------------------------------- request.id: ${screenRequest.request.id}`,
            { screenRequest }
        );
        navigation.navigate(toScreen, screenRequest);

        return new Promise<ScreenRequest<any> | ScreenError>((resolve) => {
            navigationResults.current.set(
                screenRequest.request.id,
                resolve as ResolverType
            );
        });
    };

    useEffect(() => {
        if (!screenResult) {
            console.info("useNavigationResult(): !screenResult");
            return;
        }
        const id = screenResult.result?.id ?? screenResult.error?.id;
        if (!id) {
            console.info("useNavigationResult(): !id");
            return;
        }

        const resolve = navigationResults.current.get(id);
        if (!resolve) {
            console.info(
                "useNavigationResult(): !navigationResults.current.get(id) --------------------------------- request.id:",
                id
            );
            return;
        }
        navigationResults.current.delete(id);
        resolve(screenResult);
    }, [screenResult]);

    return {
        navigateWithResult,
    };
}

/**
 * useNavigateBack() - Use this hook to navigate back to a screen which are using useNavigateWithResults()
 */
export function useNavigateBack(params?: {
    fromScreen: string | never;
    fromNavigator?: string | never;
}) {
    const { navigate } = useNavigation();

    const [_fromNavigator, _setFromNavigator] = useState<string | undefined>(
        undefined
    );
    const [_fromScreen, _setFromScreen] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (!params?.fromScreen) {
            return;
        }
        _setFromScreen(params?.fromScreen as string);
        _setFromNavigator(params?.fromNavigator as string);
    }, [params]);

    const navigateBack = useCallback(
        (result: ScreenResult<any> | ScreenError) => {
            if (!_fromNavigator && !_fromScreen) {
                console.warn(
                    "useFromScreen.tsx: ERROR: !_fromNavigator && !_fromScreen"
                );
                return;
            }
            if (_fromNavigator && !_fromScreen) {
                console.warn(
                    "useFromScreen.tsx: ERROR: _fromNavigator && !_fromScreen"
                );
                return;
            }

            if (_fromNavigator && _fromScreen) {
                navigate(_fromNavigator, {
                    screen: _fromScreen,
                    params: result,
                });
            } else {
                navigate(_fromScreen, result);
            }
        },
        [navigate, _fromNavigator, _fromScreen]
    );

    return {
        navigateBack,
    };
}
