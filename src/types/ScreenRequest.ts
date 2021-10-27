import { JsonRpcRequest } from "@json-rpc-tools/types";

export type ScreenRequest<Params> = {
    fromScreen: string;
    request: JsonRpcRequest<Params>;
    result: never;
};
