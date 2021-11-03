import { CapTablePrivateTokenTransferVP } from "./../verifiablePresentations/CapTablePrivateTokenTransferVP";
/* eslint-disable no-undef */
import {
    IDataStore,
    IDIDManager,
    IIdentifier,
    IKeyManager,
    IResolver,
    TAgent,
    VerifiableCredential,
    VerifiablePresentation,
} from "@veramo/core";
import {
    ICreateVerifiableCredentialArgs,
    ICredentialIssuer,
} from "@veramo/credential-w3c";
import {
    FindArgs,
    IDataStoreORM,
    TCredentialColumns,
} from "@veramo/data-store";
import { normalizePresentation } from "did-jwt-vc";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { JwtPayload } from "../types/JwtPayload";
import { VerifyOptions } from "../types/VerifyOptions";
import { agent as _agent, deleteVeramoData } from "./../utils/VeramoUtils";
import { SupportedVerifiableCredential } from "../verifiableCredentials/SupportedVerifiableCredentials";

export type Agent = TAgent<
    IDIDManager &
        IKeyManager &
        IDataStore &
        IDataStoreORM &
        IResolver &
        ICredentialIssuer
>;

export type useVeramoInterface = ReturnType<typeof useVeramo>;

export const useVeramo = (chainId: string) => {
    const [agent] = useState<Agent>(_agent);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [identity, setIdentity] = useState<IIdentifier>();

    // Init Veramo identity
    useEffect(() => {
        const getIdentity = async () => {
            try {
                return await agent.didManagerGetOrCreate({
                    alias: "default",
                    kms: "local",
                    provider: "did:ethr:421611",
                });
            } catch (error) {
                console.warn(error);
            }
        };
        const initWallet = async () => {
            const _identity = await getIdentity();
            if (!_identity) {
                throw Error("Identity Failed");
            }
            const publicKey = _identity.did.split(":").pop();
            if (!publicKey) {
                throw Error("No public key");
            }
            const address = ethers.utils.computeAddress(publicKey);
            if (!address) {
                throw Error("Address from identity not correct");
            }
            const CAIPAddress = `${chainId}:${address}`;
            const _accounts = [CAIPAddress];
            setAccounts(_accounts);
            setIdentity(_identity);
            console.info("Accounts => ", _accounts);
        };
        initWallet();
    }, [agent, chainId]);

    /**
     * createVC() - Creates and signs a verifiable credential
     */
    const createVC = async (
        partialVC: Partial<ICreateVerifiableCredentialArgs>
    ) => {
        if (!identity) {
            throw Error("Cant create VC, identity not initilized");
        }
        const vc = await agent.createVerifiableCredential({
            credential: {
                type: ["VerifiableCredential", "PersonCredential"],
                credentialSubject: {
                    ...(partialVC?.credential?.credentialSubject ?? {}),
                    id: identity?.did,
                },
                ...(partialVC.credential ?? {}),
                issuer: identity.did,
            },
            proofFormat: "jwt",
            save: true,
        });
        return vc;
    };

    /**
     * createVP() - Creates and signs a verifiable presentation
     */
    const createVP = async (
        verifier: string,
        verifiableCredentials: SupportedVerifiableCredential[]
    ) => {
        if (!identity) {
            throw Error("Cant create VC, identity not initilized");
        }
        const vc = await agent.createVerifiablePresentation({
            presentation: {
                holder: identity.did,
                verifier: [verifier],
                verifiableCredential:
                    verifiableCredentials as VerifiableCredential[],
            },
            proofFormat: "jwt",
        });
        return vc;
    };

    const decodeJWT = async (
        jwt: string,
        verifyOptions?: Partial<VerifyOptions>
    ) => {
        try {
            const valid = await verifyJWT(jwt);
            if (!valid) {
                console.warn("TODO : Not valid JWT");
            }
            const payload = JSON.parse(
                Buffer.from(jwt.split(".")[1], "base64").toString()
            ) as JwtPayload;
            const errors = [];
            if (verifyOptions) {
                try {
                    const isVP =
                        "vp" in payload &&
                        payload.vp.type.includes("VerifiablePresentation");

                    if (verifyOptions.requireVerifiablePresentation && !isVP) {
                        throw Error(
                            "JWT is not a VerifiablePresentation, expected a JWT with vp property and VerifiablePresentation in vp.types "
                        );
                    }
                    if (verifyOptions.decodeCredentials) {
                        if (!Array.isArray(payload.vp.verifiableCredential)) {
                            errors.push(
                                `JWT vp.verifiableCredential was ${typeof payload
                                    .vp.verifiableCredential}, expected Array`
                            );
                        }
                        const decodedVerifiableCredentials = await Promise.all(
                            payload.vp.verifiableCredential.map(
                                async (subJWT: any) => {
                                    try {
                                        // Decode sub credential with overridden options,
                                        // REVIEW Is it correct to make sure VP issuer is subject of VC?
                                        const decoded = await decodeJWT(
                                            subJWT,
                                            {
                                                ...verifyOptions,
                                                decodeCredentials: false,
                                                audience: undefined,
                                                subject: payload.vp.iss,
                                                requireVerifiablePresentation:
                                                    false,
                                            }
                                        );
                                        return decoded;
                                    } catch (error) {
                                        errors.push(
                                            `Error decoding subcredential: ${
                                                error.message
                                            }. \nSubcredential was: \n${Buffer.from(
                                                subJWT.split(".")[1],
                                                "base64"
                                            ).toString()}`
                                        );
                                    }
                                }
                            )
                        );
                        payload.vp.JWTs =
                            decodedVerifiableCredentials as JwtPayload[];
                    }
                } catch (error) {
                    errors.push(
                        `JWT traited as Verifiable Presentation, error while decoding subcredential: ${error.message}`
                    );
                }

                if (verifyOptions.audience) {
                    if (typeof payload.aud === "string") {
                        if (payload.aud !== verifyOptions.audience) {
                            errors.push(
                                `JWT audience was ${payload.aud}, expected ${verifyOptions.audience}`
                            );
                        }
                    } else if (Array.isArray(payload.aud)) {
                        if (!payload.aud.includes(verifyOptions.audience)) {
                            errors.push(
                                `JWT audience was ${payload.aud.join(
                                    " | "
                                )}, expected one of ${verifyOptions.audience}`
                            );
                        }
                    } else {
                        throw Error(
                            `JWT .aud expected string or Array, got ${typeof payload.aud}`
                        );
                    }
                }
                if (verifyOptions.issuer) {
                    if (typeof payload.iss !== "string") {
                        throw Error(
                            `JWT issuer expected string, got ${typeof payload.iss}`
                        );
                    }
                    if (typeof verifyOptions.issuer === "string") {
                        if (payload.iss !== verifyOptions.issuer) {
                            errors.push(
                                `JWT issuer was ${payload.iss}, expected ${verifyOptions.issuer}`
                            );
                        }
                    } else if (Array.isArray(verifyOptions.issuer)) {
                        if (!verifyOptions.issuer.includes(payload.iss)) {
                            errors.push(
                                `JWT issuer was ${
                                    payload.iss
                                }, expected one of ${verifyOptions.issuer.join(
                                    " | "
                                )}`
                            );
                        }
                    } else {
                        errors.push(
                            `verifyOptions.issuer was ${typeof verifyOptions.issuer}, expected Array or string`
                        );
                    }
                }
                if (verifyOptions.subject) {
                    if (payload.sub !== verifyOptions.subject) {
                        errors.push(
                            `JWT subject was ${payload.sub}, expected ${verifyOptions.subject}`
                        );
                    }
                }
            }
            if (errors.length > 0) {
                throw Error(errors.join(".\n"));
            }
            return payload;
        } catch (error) {
            console.log("Cant decode JWT => ", error.message);
            throw error;
        }
    };

    const verifyJWT = async (jwt: string) => {
        try {
            await agent.handleMessage({
                raw: jwt,
            });
            return true;
        } catch (error) {
            console.log("JWT not valid => ", error);
            return false;
        }
    };

    /* Useage
      const result = await findVC({
            where: [{ column: "issuer", value: [someDID] }],
        });
    */
    const findVC = async (args: FindArgs<TCredentialColumns>) => {
        const credentials = await agent.dataStoreORMGetVerifiableCredentials(
            args
        );
        return credentials;
    };

    const findVCByType = async (type: string[]) => {
        const res = await findVC({
            where: [
                {
                    column: "type",
                    value: [type.join(",")],
                },
            ],
        });
        // TODO - Handle picking the most recent or ??? credential
        console.info(
            `findVCByType("${type}") -> Found: ${res[0]?.verifiableCredential.type}`
        );
        return res[0]?.verifiableCredential;
    };

    const saveVP = async (vp: VerifiablePresentation | string) => {
        console.log("trysaveVp");
        console.log(vp);

        if (typeof vp === "string") {
            vp = normalizePresentation(vp);
        }
        return await agent.dataStoreSaveVerifiablePresentation({
            verifiablePresentation: vp,
        });
    };

    const signEthTreansaction = async (tx: any) => {
        const kid = identity?.keys[0].kid;
        if (!kid) {
            throw Error("Could not resolve Veramo KID");
        }
        delete tx.from;
        const result = await agent.keyManagerSignEthTX({
            kid: kid,
            transaction: tx,
        });
        return result;
    };

    return {
        agent,
        accounts,
        identity,
        findVC,
        findVCByType,
        saveVP,
        createVC,
        createVP,
        decodeJWT,
        verifyJWT,
        signEthTreansaction,
        deleteVeramoData,
    };
};
