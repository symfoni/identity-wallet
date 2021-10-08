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
    const [validEmail, setValidEmail] = useState<string | null>(null);
    const [presentLoading, setPresentLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [bankIDToken, setBankIDToken] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<any>();

    const validCredential =
        validBankIDPersonnummer !== null && validEmail !== null;

    // Local callbacks
    const onSaveCredential = async (
        _validBankIDPersonnummer: string,
        _validEmail: string
    ) => {
        const vc = await createVC({
            email: validEmail,
            streetAddress: null,
            postalCode: null,
            identityProof: bankIDToken,
        });
        const vp = await createVP(BROK_HELPERS_VERIFIER, [vc.proof.jwt]);

        setSaveLoading(true);
        try {
            await registerWithBankId(vp);
            await saveVP(vp);
        } catch (err) {
            setSaveError(err);
            console.warn({ err });
            return;
        } finally {
            setSaveLoading(false);
        }

        setValidBankIDPersonnummer(_validBankIDPersonnummer);
        setValidEmail(_validEmail);
    };

    const onPresentCredential = () => {
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
                setValidEmail(props.route.params.demoEmail);
                break;
        }
    }, [props.route.params, props.route.params?.type]);

    const bankIDInput: BankidJWTPayload | null = useMemo(() => {
        if (bankIDToken === null) {
            return null;
        }
        return decodeJWT(bankIDToken).payload as BankidJWTPayload;
    }, [bankIDToken]);

    useEffect(() => {
        if (bankIDInput?.socialno) {
            setValidBankIDPersonnummer(bankIDInput?.socialno);
        }
    }, [bankIDInput]);

    return (
        <Screen>
            <Content>
                <SmallText>Til</SmallText>
                <BigText>forvalt.no</BigText>
                <CredentialForm
                    saveLoading={saveLoading}
                    validEmail={validEmail}
                    validBankIDPersonnummer={validBankIDPersonnummer}
                    onSave={onSaveCredential}
                />
                <BulletWithText>
                    For å kunne opprette aksjeeierbok, trenger{" "}
                    <BoldText>Forvalt.no</BoldText> at du fremviser gydlig
                    legitimasjon.
                </BulletWithText>
                <BulletWithText>
                    For at legitimasjonen skal regnes som gyldig må den
                    inneholde BankID-personnumer og epost.
                </BulletWithText>
            </Content>
            {validCredential && (
                <PresentButton onPress={onPresentCredential}>
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

function CredentialForm({
    saveLoading,
    validBankIDPersonnummer,
    validEmail,
    onSave,
}: {
    saveLoading: boolean;
    validBankIDPersonnummer: string | null;
    validEmail: string | null;
    onSave: (validBankIDPersonnummer: string, validEmail: string) => void;
}) {
    const { navigateGetBankID } = useLocalNavigation();
    const [emailInput, setEmail] = useState(validEmail);
    const onChangeText = (input: String) => setEmail(input.toLowerCase());

    const validCredential = !!validBankIDPersonnummer && !!validEmail;

    const validInput =
        !!validBankIDPersonnummer &&
        emailInput &&
        emailInput !== "" &&
        emailInput?.includes("@"); // || bankdID === null;

    return (
        <CredentialFormView>
            <WhiteText>BankID-personnumer</WhiteText>
            <BigWhiteText
                weak={!validBankIDPersonnummer}
                onPress={() =>
                    !validCredential
                        ? navigateGetBankID(SCREEN_PRESENT_CREDENTIAL)
                        : null
                }>
                {validBankIDPersonnummer ?? "123456 12345"}
            </BigWhiteText>

            <WhiteText>Epost</WhiteText>
            <BigInput
                editable={!validCredential}
                placeholder="example@symfoni.id"
                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                keyboardType="email-address"
                value={validEmail}
                onChangeText={onChangeText}
            />
            {validCredential ? (
                <ValidButton>Gyldig</ValidButton>
            ) : (
                <SaveButton
                    weak={!validInput}
                    onPress={() =>
                        validInput
                            ? onSave(validBankIDPersonnummer, emailInput)
                            : null
                    }>
                    {!saveLoading ? (
                        "Lagre"
                    ) : (
                        <ActivityIndicator color="white" size="small" />
                    )}
                </SaveButton>
            )}
        </CredentialFormView>
    );
}
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
            <StatusButtonTouchable
                onPress={onPress}
                weak={weak}
                color="rgba(0, 122, 255, 0.9)">
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
    background-color: ${(props: { color: string }) => props.color};
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

const CredentialFormView = styled.View`
    background-color: rgb(130, 130, 134);
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 30px;
    padding-horizontal: 15px;
    padding-top: 20px;
    padding-bottom: 10px;
`;

const WhiteText = styled.Text`
    color: #fff;
`;
const BigWhiteText = styled.Text`
    color: ${(props: { weak: boolean }) =>
        props.weak ? "rgba(255,255,255,0.2)" : "white"};
    font-weight: bold;
    font-size: 22px;
    padding-bottom: 20px;
`;

const SmallText = styled.Text`
    margin-left: 5px;
`;
const BigText = styled.Text`
    font-size: 22px;
    padding-bottom: 20px;
    margin-left: 5px;
`;

const BigInput = styled(TextInput)`
    color: rgb(255, 255, 255);
    font-weight: bold;
    font-size: 22px;
    padding-bottom: 20px;
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
