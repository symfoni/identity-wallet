import React, { ReactNode, useContext, useMemo, useState } from "react";
import { TextInput } from "react-native";
import styled from "styled-components/native";
import { Context } from "../context";

export function PresentCredentialScreen() {
    const [hasTrustedIdentity, setHasTrustedIdentity] = useState(false);

    const Card = useMemo(() => {
        if (hasTrustedIdentity) {
            return (
                <>
                    <BulletWithText>
                        Du har utstedt gyldig legitimasjon som{" "}
                        <BoldText>Forvalt.no</BoldText> vil godta.
                    </BulletWithText>
                    <Credential />
                </>
            );
        } else {
            return (
                <>
                    <BulletWithText>
                        Du har ingen gyldige legitimasjoner. Utsted ny
                        legitimasjon ved å fylle inn feltene under.
                    </BulletWithText>
                    <CredentialForm
                        setHasTrustedIdentity={setHasTrustedIdentity}
                    />
                </>
            );
        }
    }, [hasTrustedIdentity]);

    return (
        <Screen>
            <Content>
                <BulletWithText>
                    For å kunne opprette aksjeeierbok, trenger{" "}
                    <BoldText>Forvalt.no</BoldText> at du fremviser gydlig
                    legitimasjon.
                </BulletWithText>
                <BulletWithText>
                    For at Legitimasjonen skal regnes som gyldig må den
                    inneholde BankID-personnumer og epost.
                </BulletWithText>
                {Card}
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
    width: 20;
`;
const BulletText = styled.Text`
    width: 20;
    font-size: 30px;
`;

function Credential() {
    return (
        <CredentialView>
            <WhiteText>BankID-personnumer</WhiteText>
            <BigWhiteText>123456 098765</BigWhiteText>

            <WhiteText>Epost</WhiteText>
            <BigWhiteText>jonas@symfoni.solutions</BigWhiteText>

            <TextRight>{new Date().toLocaleDateString()}</TextRight>
        </CredentialView>
    );
}
const CredentialView = styled.View`
    background-color: rgb(130, 130, 134);
    border-radius: 10px;
    margin-top: 30px;
    padding-horizontal: 15px;
    padding-top: 20px;
    padding-bottom: 15px;
`;

function CredentialForm({
    setHasTrustedIdentity,
}: {
    setHasTrustedIdentity: (input: boolean) => void;
}) {
    const [bankID, setBankID] = useState(null);
    const [email, setEmail] = useState("");
    const onChangeText = (input: String) => setEmail(input.toLowerCase());

    const valid = email !== "" && email.includes("@"); // || bankdID === null;

    return (
        <CredentialFormView>
            <WhiteText>BankID-personnumer</WhiteText>
            <BigWeakText>{"<Trykk for å hente>"}</BigWeakText>

            <WhiteText>Epost</WhiteText>
            <BigWeakInput
                placeholder="example@symfoni.id"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                value={email}
                onChangeText={onChangeText}
            />

            <UtstedButton
                weak={!valid}
                onPress={() => (valid ? setHasTrustedIdentity(true) : null)}>
                Utsted
            </UtstedButton>
        </CredentialFormView>
    );
}

const CredentialFormView = styled.View`
    background-color: rgb(0, 122, 255);
    border-radius: 10px;
    margin-top: 30px;
    padding-horizontal: 15px;
    padding-top: 20px;
    padding-bottom: 10px;
`;

const WhiteText = styled.Text`
    color: #fff;
`;
const TextRight = styled.Text`
    color: #fff;
    align-self: flex-end;
`;

const BigWhiteText = styled.Text`
    color: #fff;
    font-weight: bold;
    font-size: 22px;
    padding-bottom: 20px;
`;
const BigWeakText = styled.Text`
    color: rgba(255, 255, 255, 0.5);
    font-weight: bold;
    font-size: 22px;
    padding-bottom: 20px;
`;
const BigWeakInput = styled(TextInput)`
    color: rgb(255, 255, 255);
    font-weight: bold;
    font-size: 22px;
    padding-bottom: 20px;
`;

function UtstedButton({
    weak,
    onPress,
    children,
}: {
    onPress: () => void;
    weak: boolean;
    children: ReactNode;
}) {
    return (
        <UtstedButtonView onPress={onPress} weak={weak}>
            <UtstedButtonText weak={weak}>{children}</UtstedButtonText>
        </UtstedButtonView>
    );
}
const UtstedButtonView = styled.TouchableOpacity`
    background-color: rgb(0, 122, 255);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 44px;
    border-radius: 10px;
    border: 1px solid
        ${(props: { weak: boolean }) =>
            props.weak ? "rgba(255,255,255,0.5)" : "white"};
`;

const UtstedButtonText = styled.Text`
    color: ${(props: { weak: boolean }) =>
        props.weak ? "rgba(255,255,255,0.5)" : "white"};
    font-weight: 500;
    font-size: 16px;
`;

function SendButton({ children }: { children: ReactNode }) {
    return (
        <SendButtonView>
            <SendButtonText>{children}</SendButtonText>
        </SendButtonView>
    );
}

const SendButtonView = styled.TouchableOpacity`
    background-color: rgb(0, 122, 255);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 44px;
    margin-horizontal: 30px;
    margin-top: 20px;
    margin-bottom: 50px;
    border-radius: 10px;
`;
const SendButtonText = styled.Text`
    color: rgb(255, 255, 255);
    font-weight: 500;
    font-size: 16px;
`;
