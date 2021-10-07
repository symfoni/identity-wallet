import React from "react";
import styled from "styled-components/native";

export function ShowCredentialScreen() {
    return (
        <Screen>
            <Content>
                <BulletWithText>
                    For å kunne opprette aksjeeierbok, trenger Forvalt ditt
                    personnummer verifisert med BankID.
                </BulletWithText>
            </Content>
            <SendButton>
                <ButtonText>Send</ButtonText>
            </SendButton>
        </Screen>
    );
}

const Screen = styled.View`
    height: 100%;
`;

const Content = styled.View`
    flex: 1;
    justify-content: center;
    padding-horizontal: 30;
`;

const HelpText = styled.Text`
    padding-horizontal: 10;
    padding-vertical: 10;
`;

const ButtonText = styled.Text`
    color: rgba(255, 255, 255, 0.3);
    font-weight: 500;
    font-size: 16px;
`;

const SendButton = styled.TouchableOpacity`
    background-color: rgb(0, 122, 255);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 44px;
    margin-horizontal: 30px;
    margin-top: 10px;
    margin-bottom: 15%;
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
    align-items: center;
`;
const BulletView = styled.View`
    width: 20;
`;
const BulletText = styled.Text`
    width: 20;
    font-size: 30px;
`;

function Credential() {
    return <CredentialView />;
}

const CredentialView = styled.View`
    height: 100px;
`;
