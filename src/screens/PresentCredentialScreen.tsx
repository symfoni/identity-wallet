import React, {
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ActivityIndicator, TextInput } from "react-native";
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

export function PresentCredentialScreen(props: {
    route: { params?: ParamBankIDToken | ParamPresentCredentialDemo };
}) {
    const { navigateHome } = useLocalNavigation();
    const { createVC, createVP, saveVP } = useContext(Context);

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
    const saveNationalIdentityVC = async (_validBankIDPersonnummer: string) => {
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
                <BigText>forvalt.no</BigText>
                <SmallText>Handling</SmallText>
                <BigText>Opprett aksjeeierbok</BigText>
                <NationalIdentityVC
                    saveLoading={saveLoading}
                    validBankIDPersonnummer={validBankIDPersonnummer}
                    onSave={saveNationalIdentityVC}
                />
                <BulletWithText>
                    For å kunne opprette aksjeeierbok, trenger{" "}
                    <BoldText>Forvalt.no</BoldText> at du fremviser gydlig
                    legitimasjon.
                </BulletWithText>
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

const HelpText = styled.Text`
    padding-horizontal: 10px;
    padding-vertical: 10px;
`;

const BoldText = styled.Text`
    font-weight: 600;
`;

/**
 * @inspired by https://stackoverflow.com/a/40450857
 */
function BulletWithText({ children }: { children: React.ReactNode }) {
    return (
        <BulletRow>
            <BulletView>
                <BulletText>{"\u2022" + " "}</BulletText>
            </BulletView>
            <HelpText>{children}</HelpText>
        </BulletRow>
    );
}
const BulletRow = styled.View`
    flex-direction: row;
    margin-top: 10px;
`;
const BulletView = styled.View`
    width: 20px;
`;
const BulletText = styled.Text`
    width: 20px;
    font-size: 30px;
`;

function NationalIdentityVC({
    saveLoading,
    validBankIDPersonnummer,
    onSave,
}: {
    saveLoading: boolean;
    validBankIDPersonnummer: string | null;
    validEmail: string | null;
    onSave: (validBankIDPersonnummer: string) => void;
}) {
    const { navigateGetBankID } = useLocalNavigation();

    const validCredential = !!validBankIDPersonnummer;

    const validInput = !!validBankIDPersonnummer;

    return (
        <NationalIdentityVCView>
            <VCTitle>Nasjonal identitet</VCTitle>
            <VCBody>
                <VCPropLabel>Fødselsnummer</VCPropLabel>
                <VCPropPlaceholder
                    weak={!validBankIDPersonnummer}
                    onPress={() =>
                        !validCredential
                            ? navigateGetBankID(SCREEN_PRESENT_CREDENTIAL)
                            : null
                    }>
                    {validBankIDPersonnummer ?? "123456 54321"}
                </VCPropPlaceholder>

                {validCredential ? (
                    <ValidButton>Gyldig</ValidButton>
                ) : (
                    <SaveButton
                        weak={!validInput}
                        onPress={() =>
                            validInput ? onSave(validBankIDPersonnummer) : null
                        }>
                        {!saveLoading ? (
                            "Signer"
                        ) : (
                            <ActivityIndicator color="white" size="small" />
                        )}
                    </SaveButton>
                )}
            </VCBody>
        </NationalIdentityVCView>
    );
}

const NationalIdentityVCView = styled.View`
    background-color: rgb(130, 130, 134);
    border-radius: 8px;
    margin-top: 10px;
    margin-bottom: 30px;
    padding-top: 1px;
    padding-bottom: 10px;
`;

const VCBody = styled.View`
    margin-horizontal: 10px;
`;
const VCPropLabel = styled.Text`
    color: #fff;
`;

const VCPropPlaceholder = styled.Text`
    color: ${(props: { weak: boolean }) =>
        props.weak ? "rgba(255,255,255,0.2)" : "white"};
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 7px;
`;

function VCTitle({ children }: { children: ReactNode }) {
    return (
        <VCTitleView color="rgb(0, 122, 255)">
            <VCTitleText>{children}</VCTitleText>
        </VCTitleView>
    );
}
const VCTitleView = styled.View`
    background-color: ${(props: { color: string }) => props.color};
    padding-horizontal: 5px;
    padding-top: 4px;
    padding-bottom: 4px;
    margin-bottom: 20px;
    border-radius: 8px;
`;
const VCTitleText = styled.Text`
    color: white;
    text-align: center;
`;

function ValidButton({ children }: { children: ReactNode }) {
    return (
        <DateView>
            <DateText localValid>{new Date().toLocaleDateString()}</DateText>
            <StatusButtonTouchable color={"rgba(52, 199, 89, 0.9)"}>
                <StatusButtonText>{children}</StatusButtonText>
            </StatusButtonTouchable>
        </DateView>
    );
}

function SaveButton({
    weak,
    onPress,
    children,
}: {
    weak: boolean;
    onPress: () => void;
    children: ReactNode;
}) {
    return (
        <DateView>
            <DateText weak>--/--/----</DateText>
            <StatusButtonTouchable onPress={onPress} weak={weak}>
                <StatusButtonText weak={weak}>{children}</StatusButtonText>
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
    color: ${(props: { weak: boolean }) =>
        props.weak ? "rgba(255,255,255,0.3)" : "white"};
`;
const StatusButtonTouchable = styled.TouchableOpacity`
    background-color: ${(props: { weak: boolean }) =>
        props.weak ? "rgba(255,255,255,0.3)" : "rgba(0, 122, 255, 0.9)"};
    border-radius: 10px;
    height: 26px;
    min-width: 80px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const StatusButtonText = styled.Text`
    color: ${(props: { weak: boolean }) =>
        props.weak ? "rgba(255,255,255,0.3)" : "white"};
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
