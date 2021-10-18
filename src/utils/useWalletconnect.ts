/* eslint-disable no-undef */
import {
    JsonRpcResponse,
} from "@json-rpc-tools/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { useCallback, useEffect, useState } from "react";

import {
    DEFAULT_APP_METADATA,
    DEFAULT_EIP155_METHODS,
    DEFAULT_RELAY_PROVIDER,
} from "./../constants/default";


export type RequestMethod = 
    | "symfoniID_createCapTableVPRequest" 
    | "symfoniID_createOtherVPRequest";

type RequestMap = Map<
    RequestMethod,
    (event: SessionTypes.RequestEvent) => void
>;

export const useWalletconnect = (supportedChains: string[]) => {
    const [client, setClient] = useState<Client | undefined>(undefined);

    // Handle requests
    const [requestMap, setRequestMap] = useState<RequestMap>(new Map());

    const getRequestEvent = (method: RequestMethod) => {
        return new Promise<SessionTypes.RequestEvent>((resolve) => {
            setRequestMap((current: RequestMap) => {
                const next = new Map(current);
                next.set(method, resolve);
                return next;
            });
        })
    }

    const handleRequest = (event: SessionTypes.RequestEvent) => {
        console.info("useWalletConnect.ts: handleRequest(): ", event.request.method);
        requestMap.get(event.request.method as RequestMethod)?.(event);
    };

    // Init Walletconnect client
    useEffect(() => {
        const initClient = async () => {
            try {
                console.log(`Starting Client...`);
                const _client = await Client.init({
                    controller: true,
                    relayProvider: DEFAULT_RELAY_PROVIDER,
                    metadata: DEFAULT_APP_METADATA,
                    storageOptions: {
                        asyncStorage: AsyncStorage as any,
                    },
                });
                console.log("Client started!");
                setClient(_client);
            } catch (e) {
                console.log("Failed to start Client!");
                console.error(e);
            }
        };
        initClient();
        return () => {
            console.log("Destroyed client");
        };
    }, []);

    const pair = async (uri: string) => {
        console.log(`pair(): Uri: ${uri}`);
        const pairResult = await client?.pair({ uri: uri });
        console.log("pari", pairResult);
        console.log("PairResult", pairResult);
    };


    const sendResponse = useCallback(
        (topic: string, response: JsonRpcResponse<any>) => {
            client?.respond({ topic, response });
        },
        [client]
    );

    const handlePruposal = useCallback(
        (_proposal: SessionTypes.Proposal) => {
            console.log("Received PROPOSAL: ", _proposal);
            if (typeof client === "undefined") {
                return;
            }
            const unsupportedChains = [];
            _proposal.permissions.blockchain.chains.forEach((chainId) => {
                if (supportedChains.includes(chainId)) {
                    return;
                }
                unsupportedChains.push(chainId);
            });
            if (unsupportedChains.length) {
                return client.reject({ proposal: _proposal });
            }
            const unsupportedMethods: string[] = [];
            _proposal.permissions.jsonrpc.methods.forEach((method) => {
                if (DEFAULT_EIP155_METHODS.includes(method)) {
                    return;
                }
                unsupportedMethods.push(method);
            });
            if (unsupportedMethods.length) {
                return client.reject({ proposal: _proposal });
            }
        },
        [supportedChains, client]
    );

    const closeSession = async (topic: string) => {
        if (!client) {
            throw new Error("Client is not initialized");
        }
        client.disconnect({
            topic: topic,
            reason: {
                message: "User closed session from app.",
                code: 123,
            },
        });
    };

    // Subscribe / Unsubscribe Walletconnect
    useEffect(() => {
        const subscribeClient = async () => {
            try {
                if (!client) {
                    return;
                }
                console.log("Subscribiing Client...");
                client.on(CLIENT_EVENTS.session.proposal, handlePruposal);
                client.on(CLIENT_EVENTS.session.request, handleRequest);
                console.log("Subscribed pruposal");
                console.log("Subscribed request");
            } catch (e) {
                console.log("Failed to subscribe Client!");
                console.error(e);
            }
        };
        subscribeClient();
        return () => {
            if (client) {
                client.removeListener(
                    CLIENT_EVENTS.session.proposal,
                    handlePruposal
                );
                client.removeListener(
                    CLIENT_EVENTS.session.request,
                    handleRequest
                );
            }
            console.log("Destroyed subscribe");
        };
    }, [client, handlePruposal, handleRequest]);

    return {
        client,
        closeSession,
        pair,
        getRequestEvent,
        sendResponse,
    };
};
