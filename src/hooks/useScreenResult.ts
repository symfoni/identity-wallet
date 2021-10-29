import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useScreenResult<Result>(params?: {
    result: Result | never;
}): [Result | undefined, Dispatch<SetStateAction<Result | undefined>>] {
    const [_result, _setResult] = useState<Result | undefined>(undefined);

    useEffect(() => {
        if (params?.result) {
            _setResult(params?.result as Result);
        }
    }, [params?.result]);

    return [_result, _setResult];
}
