import React, { ReactNode, useContext, useMemo, useState } from "react";
import { Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { useLocalNavigation } from "../hooks/useLocalNavigation";

export function PresentCredentialScreen() {
    const [bankID, setBankID] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const hasTrustedIdentity =
        email !== null && email !== "" && email.includes("@");

    return (
        <Screen>
            <Content>
                <SmallText>Til</SmallText>
                <BigText>forvalt.no</BigText>
                <CredentialForm
                    bankID={bankID}
                    email={email}
                    onSave={(_email) => {
                        setEmail(_email);
                    }}
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
            {hasTrustedIdentity && <SendButton>Vis</SendButton>}
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
    bankID,
    email,
    onSave,
}: {
    bankID: string | null;
    email: string | null;
    onSave: (email: string) => void;
}) {
    const { navigateGetBankID } = useLocalNavigation();
    const [localBankID, setBankID] = useState(bankID);
    const [localEmail, setEmail] = useState(email);
    const onChangeText = (input: String) => setEmail(input.toLowerCase());

    const valid = email && email !== "" && email?.includes("@");
    const localValid =
        localEmail && localEmail !== "" && localEmail?.includes("@"); // || bankdID === null;

    return (
        <CredentialFormView>
            <WhiteText>BankID-personnumer</WhiteText>
            <BigWhiteText weak={true} onPress={navigateGetBankID}>
                {"123456 098765"}
            </BigWhiteText>

            <WhiteText>Epost</WhiteText>
            <BigInput
                editable={!valid}
                placeholder="example@symfoni.id"
                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                keyboardType="email-address"
                value={email}
                onChangeText={onChangeText}
            />
            {valid ? (
                <ValidButton>Gyldig</ValidButton>
            ) : (
                <SaveButton
                    weak={!localValid}
                    onPress={() => onSave(localEmail)}>
                    Lagre
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

function SendButton({ children }: { children: ReactNode }) {
    return (
        <SendButtonView>
            <SendButtonText>{children}</SendButtonText>
        </SendButtonView>
    );
}

const SendButtonView = styled.TouchableOpacity`
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
const SendButtonText = styled.Text`
    color: rgb(255, 255, 255);
    font-weight: 500;
    font-size: 16px;
`;
