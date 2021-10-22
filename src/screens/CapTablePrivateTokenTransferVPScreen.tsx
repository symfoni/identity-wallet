import { JsonRpcRequest, JsonRpcResult } from "@json-rpc-tools/types";
import { formatJsonRpcResult } from "@json-rpc-tools/utils";
import { decodeJWT } from "did-jwt";
import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ActivityIndicator, Linking } from "react-native";
import styled from "styled-components/native";
import { Context } from "../context";
import { useDeviceAuthentication } from "../hooks/useDeviceAuthentication";
import {
    SCREEN_BANKID,
    SCREEN_CREATE_CAP_TABLE_VP,
    useLocalNavigation,
} from "../hooks/useLocalNavigation";
import { useNavigationWithResult } from "../hooks/useNavigationWithResult";
import { BankidJWTPayload } from "../types/bankid.types";
import {
    CapTablePrivateTokenTransferParams,
    CapTablePrivateTokenTransferResult,
} from "../types/capTableTypes";
import { BankIDResult, makeBankIDRequest } from "../types/paramTypes";
import { CapTablePrivateTokenTransferVC } from "../verifiableCredentials/CapTablePrivateTokenTransferVC";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";

export function CapTablePrivateTokenTransferVPScreen(props: {
    route: {
        params?:
            | JsonRpcRequest<CapTablePrivateTokenTransferParams>
            | JsonRpcResult<BankIDResult>;
    };
}) {
    const { checkDeviceAuthentication } = useDeviceAuthentication();
    const { navigateHome } = useLocalNavigation();
    const { navigateWithResult } = useNavigationWithResult(
        props.route.params as JsonRpcResult<BankIDResult>
    );
    const {
        createTermsOfUseVC,
        createNationalIdentityVC,
        createCapTablePrivateTransferVP,
    } = useContext(Context);

    // Local data
    const [nationalIdentityNumber, setNationalIdentityNumber] = useState<
        string | null
    >(null);

    const [request, setRequest] = useState<
        JsonRpcRequest<CapTablePrivateTokenTransferParams> | undefined
    >(undefined);

    // Loading
    const [presentLoading, setPresentLoading] = useState(false);
    const [loadingSigningTermsOfUseVC, setLoadingTermsOfUseVC] =
        useState(false);
    const [loadingNationalIdentityVC, setLoadingNationalIdentityVC] =
        useState(false);

    const presentable =
        !!request?.params.capTableTermsOfUseVC &&
        !!request?.params.nationalIdentityVC;

    // createNationalIdentityVC
    const onSignNationalIdentityVC = useCallback(async () => {
        if (!request) {
            console.error("CreateCapTableVPScreen.tsx: !request");
            return;
        }

        const bankIDRequest = makeBankIDRequest({
            resultScreen: SCREEN_CREATE_CAP_TABLE_VP,
        });

        const result = await navigateWithResult(SCREEN_BANKID, bankIDRequest);

        const bankID = decodeJWT(result.result.bankIDToken)
            .payload as BankidJWTPayload;
        setLoadingNationalIdentityVC(true);

        try {
            const nationalIdentityVC = await createNationalIdentityVC(
                bankID.socialno,
                {
                    type: "BankID",
                    jwt: result.result.bankIDToken,
                }
            );
            setRequest({
                ...request,
                params: {
                    ...request.params,
                    nationalIdentityVC,
                },
            });
        } finally {
            setLoadingNationalIdentityVC(false);
        }
    }, [request, createNationalIdentityVC, navigateWithResult]);

    // createTermsOfUseVC
    const onSignCapTableTermsOfUse = async (readAndAcceptedID: string) => {
        if (!request) {
            console.error("CapTablePrivateTransferVPScreen.tsx: !request");
            return;
        }

        try {
            setLoadingTermsOfUseVC(true);

            const authenticated = await checkDeviceAuthentication();
            if (!authenticated) {
                return;
            }

            const capTableTermsOfUseVC = await createTermsOfUseVC(
                readAndAcceptedID
            );
            setRequest({
                ...request,
                params: {
                    ...request.params,
                    capTableTermsOfUseVC,
                },
            });
        } finally {
            setLoadingTermsOfUseVC(false);
        }
    };

    // presentCapTablePrivateTokenTransferVP
    const presentCapTablePrivateTokenTransferVP = async () => {
        if (
            !request ||
            !request.params.capTableTermsOfUseVC ||
            !request.params.capTablePrivateTokenTransferVC ||
            !request.params.nationalIdentityVC
        ) {
            console.error(
                `!request ||
            !request.params.capTableTermsOfUseVC ||
            !request.params.capTablePrivateTokenTransferVC ||
            !request.params.nationalIdentityVC`
            );
            return;
        }

        setPresentLoading(true);

        // Creating the VP
        const capTablePrivateTokenTransferVP =
            await createCapTablePrivateTransferVP(
                request.params.verifier,
                request.params.capTablePrivateTokenTransferVC,
                request.params.nationalIdentityVC
            );

        const result = formatJsonRpcResult<CapTablePrivateTokenTransferResult>(
            request.id,
            {
                capTablePrivateTokenTransferVP,
            }
        );
        navigateHome(result);
    };

    // UseEffects
    useEffect(() => {
        const maybeRequest = props.route.params as
            | JsonRpcRequest<CapTablePrivateTokenTransferParams>
            | undefined;

        switch (maybeRequest?.method) {
            case "symfoniID_createCapTableVP":
                setRequest(maybeRequest);
                break;
        }
    }, [props.route.params]);

    if (!props.route.params?.id) {
        return null;
    }

    return (
        <Screen>
            <Content>
                <SmallText>Til</SmallText>
                <BigText>Brønnøysundregisteret</BigText>

                <SmallText>For å kunne</SmallText>
                <BigText>Overføre aksjer</BigText>

                <TermsOfUseVCCard
                    vc={request?.params.capTableTermsOfUseVC}
                    loading={loadingSigningTermsOfUseVC}
                    termsOfUseID="https://brreg.no/TOA"
                    onSign={onSignCapTableTermsOfUse}
                />
                <TermsOfUseVCCard
                    vc={request?.params.capTableTermsOfUseVC}
                    loading={loadingSigningTermsOfUseVC}
                    termsOfUseID="https://symfoni.id/TOA"
                    onSign={onSignCapTableTermsOfUse}
                />
                <NationalIdentityVCCard
                    vc={request?.params.nationalIdentityVC}
                    loading={loadingNationalIdentityVC}
                    onSign={onSignNationalIdentityVC}
                />
                <PrivateTransferVCCard
                    vc={request?.params.capTablePrivateTokenTransferVC}
                />
            </Content>
            {presentable && (
                <PresentButton onPress={presentCapTablePrivateTokenTransferVP}>
                    {!presentLoading ? (
                        "Vis"
                    ) : (
                        <ActivityIndicator color="white" size="small" />
                    )}
                </PresentButton>
            )}
        </Screen>
    );
}

const Screen = styled.View`
    height: 100%;
    background: white;
    border: 1px solid white;
`;

const Content = styled.View`
    flex: 1;
    padding-horizontal: 30px;
    padding-vertical: 30px;
`;

function PrivateTransferVCCard({
    vc,
}: {
    vc: CapTablePrivateTokenTransferVC | undefined;
}) {
    // TODO hvordan skal denne se ut?
    return (
        <VCCard>
            <VCPropLabel>Overfør</VCPropLabel>
            <VCPropText>
                {vc?.credentialSubject?.toShareHolder.amount}
            </VCPropText>
            <VCPropLabel></VCPropLabel>
            <VCPropText>{vc?.credentialSubject?.toShareHolder.name}</VCPropText>
        </VCCard>
    );
}

function NationalIdentityVCCard({
    vc,
    loading,
    onSign,
}: {
    vc: NationalIdentityVC | undefined;
    loading: boolean;
    onSign: () => Promise<void>;
}) {
    const signed = !!vc;
    const valid = true;

    return (
        <VCCard>
            <VCPropLabel>Fødselsnummer</VCPropLabel>
            <VCPropText placeholder={valid && !signed}>
                {vc?.credentialSubject?.nationalIdentityNumber ??
                    "123456 54321"}
            </VCPropText>
            <SignButton
                valid={valid}
                loading={loading}
                signed={signed}
                expirationDate={vc?.expirationDate}
                onPress={() => (valid && !signed ? onSign() : null)}
            />
        </VCCard>
    );
}

function TermsOfUseVCCard({
    vc,
    loading,
    termsOfUseID,
    onSign,
}: {
    vc: TermsOfUseVC | undefined;
    loading: boolean;
    termsOfUseID: string;
    onSign: (termsOfUse: string) => {};
}) {
    const signed = !!vc;

    return (
        <VCCard>
            <VCPropLabel>Lest og akseptert</VCPropLabel>
            <VCPropHyperlink onPress={() => Linking.openURL(termsOfUseID)}>
                {termsOfUseID}
            </VCPropHyperlink>
            <SignButton
                valid={true}
                signed={signed}
                loading={loading}
                expirationDate={vc?.expirationDate}
                onPress={() => onSign(termsOfUseID)}
            />
        </VCCard>
    );
}

const VCCard = styled.View`
    background-color: rgb(105, 105, 107);
    border-radius: 8px;
    margin-top: 15px;
    margin-bottom: 2px;
    padding-horizontal: 10px;
    padding-top: 25px;
    padding-bottom: 10px;
`;

const VCPropLabel = styled.Text`
    margin-top: 5px;
    color: #fff;
`;

const VCPropText = styled.Text`
    color: ${(props: { placeholder: boolean }) =>
        props.placeholder ? "rgba(255,255,255,0.2)" : "white"};
    font-weight: bold;
    font-size: 19px;
    margin-bottom: 7px;
`;

const VCPropHyperlink = styled.Text`
    color: white;
    font-weight: bold;
    font-size: 17.5px;
    margin-bottom: 25px;
`;

function SignButton({
    valid,
    loading,
    signed,
    expirationDate,
    onPress,
}: {
    valid: boolean;
    loading: boolean;
    signed: boolean;
    expirationDate?: string;
    onPress: () => void;
}) {
    const backgroundColor = useMemo(() => {
        if (!valid) {
            return "rgba(255,255,255,0.3)";
        } else if (!signed) {
            return "rgba(0, 122, 255, 0.9)";
        } else {
            return "rgba(52, 199, 89, 0.9)";
        }
    }, [valid, signed]);

    const color = useMemo(() => {
        if (!valid) {
            return "rgba(255,255,255,0.3)";
        } else {
            return "white";
        }
    }, [valid]);

    const text = useMemo(() => {
        if (!loading && !signed) {
            return "Signer";
        } else if (loading) {
            return <ActivityIndicator />;
        } else {
            return "Gyldig";
        }
    }, [loading, signed]);

    const onPressWhenValidAndNotSigned = useMemo(() => {
        if (valid && !signed) {
            return onPress;
        } else {
            return () => {
                console.info("Button disabled");
            };
        }
    }, [onPress, valid, signed]);

    const expirationDateText = useMemo(() => {
        if (!expirationDate) {
            return "--/--/----";
        }
        return `Utløper ${
            new Date(expirationDate).toISOString().split("T")[0]
        }`;
    }, [expirationDate]);

    return (
        <DateView>
            <DateText color={color}>{expirationDateText}</DateText>
            <StatusButtonTouchable
                onPress={onPressWhenValidAndNotSigned}
                backgroundColor={backgroundColor}>
                <StatusButtonText color={color}>{text}</StatusButtonText>
            </StatusButtonTouchable>
        </DateView>
    );
}
const DateView = styled.View`
    display: flex;
    flex-direction: row;
    align-self: flex-end;
    align-items: center;
`;
const DateText = styled.Text`
    margin-right: 10px;
    color: ${(props: { color: string }) => props.color};
`;
const StatusButtonTouchable = styled.TouchableOpacity`
    background-color: ${(props: { backgroundColor: string }) =>
        props.backgroundColor};
    border-radius: 10px;
    height: 26px;
    min-width: 80px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const StatusButtonText = styled.Text`
    color: ${(props: { color: string }) => props.color};
    font-weight: 600;
    font-size: 13px;
`;

const SmallText = styled.Text`
    margin-left: 5px;
`;
const BigText = styled.Text`
    font-size: 22px;
    padding-bottom: 20px;
    margin-left: 5px;
`;

function PresentButton({
    children,
    onPress,
}: {
    children: ReactNode;
    onPress: () => void;
}) {
    return (
        <PresentButtonView onPress={onPress}>
            <PresentButtonText>{children}</PresentButtonText>
        </PresentButtonView>
    );
}

const PresentButtonView = styled.TouchableOpacity`
    background-color: rgb(52, 199, 89);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 44px;
    margin-horizontal: 30px;
    margin-top: 20px;
    margin-bottom: 50px;
    border-radius: 10px;
    width: 200px;
    align-self: center;
`;
const PresentButtonText = styled.Text`
    color: rgb(255, 255, 255);
    font-weight: 500;
    font-size: 16px;
`;
