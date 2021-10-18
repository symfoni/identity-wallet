import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ActivityIndicator, Linking } from "react-native";
import { decodeJWT } from "did-jwt";
import styled from "styled-components/native";
import {
    SCREEN_CREATE_CAP_TABLE_VP,
    useLocalNavigation,
} from "../hooks/useLocalNavigation";
import { BankidJWTPayload } from "../types/bankid.types";
import { Context } from "../context";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";
import { NationalIdentityVC } from "../verifiableCredentials/NationalIdentityVC";
import { BROK_HELPERS_VERIFIER } from "@env";
import { CreateCapTableVPRequest } from "../types/createCapTableVPTypes";

export function CreateCapTableVPScreen(props: {
    route: {
        params?: CreateCapTableVPRequest;
    };
}) {
    const { navigateHome } = useLocalNavigation();
    const {
        createTermsOfUseVC,
        createNationalIdentityVC,
        createCreateCapTableVP,
    } = useContext(Context);

    // Local data
    const [nationalIdentityNumber, setNationalIdentityNumber] = useState<
        string | null
    >(null);
    const [presentLoading, setPresentLoading] = useState(false);

    // TermsOfUseVC
    const [capTableTermsOfUseVC, setCapTableTermsOfUseVC] =
        useState<TermsOfUseVC | null>(null);
    const [loadingSigningTermsOfUseVC, setLoadingTermsOfUseVC] =
        useState(false);

    // NationalIdentityVC
    const [nationalIdentityVC, setNationalIdentityVC] =
        useState<NationalIdentityVC | null>(null);
    const [loadingNationalIdentityVC, setLoadingNationalIdentityVC] =
        useState(false);

    const presentable = !!capTableTermsOfUseVC && !!nationalIdentityVC;

    // createNationalIdentityVC
    const onSignNationalIdentityVC = useCallback(
        async (_nationalIdentityNumber: string, jwt: string) => {
            try {
                setLoadingNationalIdentityVC(true);
                const vc = await createNationalIdentityVC(
                    _nationalIdentityNumber,
                    {
                        type: "BankID",
                        jwt,
                    }
                );
                setNationalIdentityVC(vc);
            } finally {
                setLoadingNationalIdentityVC(false);
            }
        },
        [createNationalIdentityVC]
    );

    // createTermsOfUseVC
    const onSignCapTableTermsOfUse = async (readAndAcceptedID: string) => {
        try {
            setLoadingTermsOfUseVC(true);
            const _capTableTermsOfUseVC = await createTermsOfUseVC(
                readAndAcceptedID
            );
            setCapTableTermsOfUseVC(_capTableTermsOfUseVC);
        } finally {
            setLoadingTermsOfUseVC(false);
        }
    };

    // presentCreateCapTableVP
    const presentCreateCapTableVP = async () => {
        if (!presentable || !props.route.params) {
            console.error("presentCreateCapTableVP(): !presentable");
            return;
        }
        setPresentLoading(true);
        const createCapTableVP = await createCreateCapTableVP(
            props.route.params?.params.verifier,
            capTableTermsOfUseVC,
            nationalIdentityVC
        );
        setTimeout(
            () =>
                navigateHome({
                    type: "CREATE_CAP_TABLE_VP_RESPONSE",
                    payload: {
                        createCapTableVP,
                    },
                }),
            1000
        );
    };

    // UseEffects
    useEffect(() => {
        switch (props.route.params?.method) {
            case "symfoniID_createCapTableVPRequest":
                setCapTableTermsOfUseVC(
                    props.route.params?.params.capTableTermsOfUseVC ?? null
                );
                setNationalIdentityVC(
                    props.route.params?.params.nationalIdentityVC ?? null
                );
                break;
        }
    }, [props.route.params, onSignNationalIdentityVC]);

    return (
        <Screen>
            <Content>
                <SmallText>Til</SmallText>
                <BigText>Brønnøysundregisteret</BigText>

                <SmallText>For å kunne</SmallText>
                <BigText>Opprette aksjeeierbok</BigText>

                <TermsOfUseVCCard
                    vc={capTableTermsOfUseVC}
                    loading={loadingSigningTermsOfUseVC}
                    termsOfUseID="https://forvalt.brreg.no/brukervilkår"
                    onSign={onSignCapTableTermsOfUse}
                />
                <NationalIdentityVCCard
                    vc={nationalIdentityVC}
                    loading={loadingNationalIdentityVC}
                    nationalIdentityNumber={nationalIdentityNumber}
                    onSign={() => {}}
                />
            </Content>
            {presentable && (
                <PresentButton onPress={presentCreateCapTableVP}>
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

function NationalIdentityVCCard({
    vc,
    nationalIdentityNumber,
    loading,
    onSign,
}: {
    vc: NationalIdentityVC | null;
    nationalIdentityNumber: string | null;
    loading: boolean;
    onSign: (nationalIdentityNumber: string) => void;
}) {
    const { navigateGetBankID } = useLocalNavigation();

    const signed = !!vc;

    const _nationalIdentityNumber =
        vc?.credentialSubject?.nationalIdentityNumber ?? nationalIdentityNumber;

    const valid = true;

    return (
        <VCCard>
            <VCPropLabel>Fødselsnummer</VCPropLabel>
            <VCPropText placeholder={valid && !signed}>
                {_nationalIdentityNumber ?? "123456 54321"}
            </VCPropText>
            <SignButton
                valid={valid}
                loading={loading}
                signed={signed}
                expirationDate={vc?.expirationDate}
                onPress={() =>
                    valid && !signed
                        ? navigateGetBankID(SCREEN_CREATE_CAP_TABLE_VP)
                        : null
                }
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
    vc: TermsOfUseVC | null;
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
