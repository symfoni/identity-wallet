import React, {
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ActivityIndicator, Linking } from "react-native";
import { decodeJWT } from "did-jwt";
import styled from "styled-components/native";
import {
    SCREEN_PRESENT_CREDENTIAL,
    useLocalNavigation,
} from "../hooks/useLocalNavigation";
import { BankidJWTPayload } from "../types/bankid.types";
import {
    ParamBankIDToken,
    ParamPresentCredentialDemo,
} from "../types/paramTypes";
import { Context } from "../context";
import { BROK_HELPERS_VERIFIER } from "@env";
import { registerWithBankId } from "../domain/brok-helpers";
import { TermsOfUseVC } from "../verifiableCredentials/TermsOfUseVC";

export function PresentCredentialScreen(props: {
    route: { params?: ParamBankIDToken | ParamPresentCredentialDemo };
}) {
    const { navigateHome } = useLocalNavigation();
    const { createVC, createVP, saveVP, createTermsOfUseVC } =
        useContext(Context);

    // Local data
    const [validBankIDPersonnummer, setValidBankIDPersonnummer] = useState<
        string | null
    >(null);
    const [presentLoading, setPresentLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<any>();

    const [bankIDToken, setBankIDToken] = useState<string | null>(null);

    const validCredential = validBankIDPersonnummer !== null;

    const bankIDPayload = useMemo(() => {
        if (bankIDToken === null) {
            return null;
        }
        return decodeJWT(bankIDToken).payload as BankidJWTPayload;
    }, [bankIDToken]);

    // Local callbacks
    const onSignNationalIdentityVC = async (
        _validBankIDPersonnummer: string
    ) => {
        const vc = await createVC({
            identityProof: bankIDToken,
        });
        const vp = await createVP(BROK_HELPERS_VERIFIER, [vc.proof.jwt]);

        setSaveLoading(true);
        try {
            const { data: signedVP } = await registerWithBankId(vp);
            await saveVP(signedVP);
        } catch (err) {
            setSaveError(err);
            console.warn({ err });
            return;
        } finally {
            setSaveLoading(false);
        }

        setValidBankIDPersonnummer(_validBankIDPersonnummer);
    };

    const [capTableTermsOfUseVC, setCapTableTermsOfUseVC] =
        useState<TermsOfUseVC | null>(null);
    const [loadingSigningTermsOfUse, setLoadingTermsOfUse] = useState(false);

    const onSignCapTableTermsOfUse = async (readAndAcceptedID: string) => {
        setLoadingTermsOfUse(true);
        try {
            const _capTableTermsOfUseVC = await createTermsOfUseVC(
                readAndAcceptedID
            );
            setCapTableTermsOfUseVC(_capTableTermsOfUseVC);
        } finally {
            setLoadingTermsOfUse(false);
        }
    };

    const presentCreateCapTableVP = () => {
        setPresentLoading(true);
        setTimeout(() => navigateHome(), 2000);
    };

    // UseEffects
    useEffect(() => {
        switch (props.route.params?.type) {
            case "PARAM_BANKID_TOKEN":
                setBankIDToken(props.route.params.bankIDToken);
                break;
            case "PARAM_PRESENT_CREDENTIAL_DEMO":
                setValidBankIDPersonnummer(
                    props.route.params.demoBankIDPersonnummer
                );
                break;
        }
    }, [props.route.params]);

    useEffect(() => {
        if (bankIDPayload?.socialno) {
            setValidBankIDPersonnummer(bankIDPayload?.socialno);
        }
    }, [bankIDPayload]);

    return (
        <Screen>
            <Content>
                <SmallText>Til</SmallText>
                <BigText>Brønnøysundregisteret</BigText>

                <SmallText>For å kunne</SmallText>
                <BigText>Opprette aksjeeierbok</BigText>

                <CapTableFormVC />
                <CapTableTermsOfUseVC
                    vc={capTableTermsOfUseVC}
                    loading={loadingSigningTermsOfUse}
                    onSign={onSignCapTableTermsOfUse}
                />
                <NationalIdentityVC
                    saveLoading={saveLoading}
                    validBankIDPersonnummer={validBankIDPersonnummer}
                    onSign={onSignNationalIdentityVC}
                />
            </Content>
            {validCredential && (
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

function NationalIdentityVC({
    saveLoading,
    validBankIDPersonnummer,
    onSign,
}: {
    saveLoading: boolean;
    validBankIDPersonnummer: string | null;
    onSign: (validBankIDPersonnummer: string) => void;
}) {
    const { navigateGetBankID } = useLocalNavigation();

    const validCredential = !!validBankIDPersonnummer;

    const validInput = !!validBankIDPersonnummer;

    return (
        <NationalIdentityVCView>
            <VCTitle>Nasjonal identitet</VCTitle>
            <VCBody>
                <VCPropLabel>Fødselsnummer</VCPropLabel>
                <VCPropText
                    placeholder={!validBankIDPersonnummer}
                    onPress={() =>
                        !validCredential
                            ? navigateGetBankID(SCREEN_PRESENT_CREDENTIAL)
                            : null
                    }>
                    {validBankIDPersonnummer ?? "123456 54321"}
                </VCPropText>
                <SignButton
                    valid={!validInput}
                    loading={saveLoading}
                    signed={validCredential}
                    onPress={() =>
                        validInput ? onSign(validBankIDPersonnummer) : null
                    }
                />
            </VCBody>
        </NationalIdentityVCView>
    );
}

function CapTableTermsOfUseVC({
    vc,
    loading,
    onSign,
}: {
    vc: TermsOfUseVC | null;
    loading: boolean;
    onSign: (termsOfUse: string) => {};
}) {
    const termsOfUseID = "https://forvalt.brreg.no/brukervilkår";
    const signed = !!vc;

    return (
        <NationalIdentityVCView>
            <VCTitle signed={signed}>Aksjeeierbok brukervilkår</VCTitle>

            <VCBody>
                <VCPropLabel>Lest og akseptert</VCPropLabel>
                <VCPropHyperlink onPress={() => Linking.openURL(termsOfUseID)}>
                    {termsOfUseID}
                </VCPropHyperlink>
                <SignButton
                    valid={true}
                    signed={signed}
                    loading={loading}
                    onPress={() => onSign(termsOfUseID)}
                />
            </VCBody>
        </NationalIdentityVCView>
    );
}

function CapTableFormVC() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    return (
        <NationalIdentityVCView>
            <VCTitle signed={true}>Aksjeeierbok skjema</VCTitle>
        </NationalIdentityVCView>
    );
}

const NationalIdentityVCView = styled.View`
    background-color: rgb(105, 105, 107);
    border-radius: 8px;
    margin-top: 15px;
    margin-bottom: 2px;
`;

const VCBody = styled.View`
    margin-horizontal: 10px;
    padding-top: 15px;
    padding-bottom: 10px;
`;
const VCPropLabel = styled.Text`
    margin-top: 5px;
    color: #fff;
`;

const VCPropRow = styled.View`
    flex-direction: row;
    align-items: center;
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

const VCPropSwitch = styled.Switch`
    margin-top: 6px;
    margin-left: 5px;
`;

function VCTitle({
    children,
    signed,
}: {
    signed: boolean;
    children: ReactNode;
}) {
    const backgroundColor = useMemo(() => {
        if (!signed) {
            return "rgba(0, 122, 255, 0.9)";
        } else {
            return "rgba(52, 199, 89, 0.9)";
        }
    }, [signed]);

    return (
        <VCTitleView backgroundColor={backgroundColor}>
            <VCTitleText>{children}</VCTitleText>
        </VCTitleView>
    );
}
const VCTitleView = styled.View`
    background-color: ${(props: { backgroundColor: string }) =>
        props.backgroundColor};
    padding-horizontal: 5px;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 8px;
`;
const VCTitleText = styled.Text`
    color: white;
    text-align: center;
`;

function SignButton({
    valid,
    loading,
    signed,
    onPress,
}: {
    valid: boolean;
    loading: boolean;
    signed: boolean;
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

    return (
        <DateView>
            <DateText color={color}>--/--/----</DateText>
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
