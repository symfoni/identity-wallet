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
import { agent as _agent, deleteVeramoData } from "../utils/VeramoUtils";
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
                type: ["VerifiableCredential"],
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
        signEthTreansaction,
        deleteVeramoData,
    };
};
