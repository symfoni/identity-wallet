import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

export function PresentCredentialScreen() {
    return (
        <Screen>
            <Content>
                <BulletWithText>
                    For å kunne opprette aksjeeierbok, trenger{" "}
                    <BoldText>Forvalt.no</BoldText> at du fremviser
                    legitimasjon.
                </BulletWithText>
                <BulletWithText>
                    Legitimasjonen må inneholde BankID-personnumer og epost.
                </BulletWithText>
                <BulletWithText>
                    Du har allerede utstedt legitimasjon som kan brukes av{" "}
                    <BoldText>Forvalt.no</BoldText>:
                </BulletWithText>
                <Credential />
            </Content>
            <SendButton>
                <ButtonText>Vis</ButtonText>
            </SendButton>
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

const ButtonText = styled.Text`
    color: rgba(255, 255, 255, 0.3);
    font-weight: 500;
    font-size: 16px;
`;

const BoldText = styled.Text`
    font-weight: 600;
`;

const SendButton = styled.TouchableOpacity`
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

            <TextRight>Ustedt: 12.09.2021</TextRight>
        </CredentialView>
    );
}

const CredentialView = styled.View`
    background-color: rgb(0, 122, 255);
    border-radius: 10px;
    margin-top: 30px;
    padding-horizontal: 15px;
    padding-top: 20px;
    padding-bottom: 15px;
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
