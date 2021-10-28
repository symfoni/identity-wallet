import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useFromScreen(params?: {
    fromScreen: string | never;
}): string | undefined {
    const [_fromScreen, _setFromScreen] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (params?.fromScreen) {
            _setFromScreen(params?.fromScreen as string);
        }
    }, [params?.fromScreen]);

    return _fromScreen;
}
