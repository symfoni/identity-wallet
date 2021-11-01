import { useEffect, useState } from "react";

export function useFromScreen(params?: {
    fromScreen: string | never;
    fromNavigator: string | never;
}) {
    const [_fromNavigator, _setFromNavigator] = useState<string | undefined>(
        undefined
    );
    const [_fromScreen, _setFromScreen] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        _setFromScreen(params?.fromScreen as string);
        _setFromNavigator(params?.fromNavigator as string);
    }, [params]);

    return {
        fromScreen: _fromScreen,
        fromNavigator: _fromNavigator,
    };
}
