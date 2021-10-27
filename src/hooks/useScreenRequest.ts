import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useScreenRequest<Request>(params?: {
    request: Request | never;
}): [Request | undefined, Dispatch<SetStateAction<Request | undefined>>] {
    const [_request, _setRequest] = useState<Request | undefined>(undefined);

    useEffect(() => {
        if (params?.request) {
            _setRequest(params?.request as Request);
        }
    }, [params?.request]);

    return [_request, _setRequest];
}
