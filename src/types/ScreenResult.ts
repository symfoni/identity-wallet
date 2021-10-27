import { JsonRpcResult } from "@json-rpc-tools/types";

export type ScreenResult<Result> = {
    fromScreen: never;
    request: never;
    result: JsonRpcResult<Result>;
};
