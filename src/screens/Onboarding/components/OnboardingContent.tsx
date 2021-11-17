import React, { ReactNode } from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

export function OnboardingContent({
    children,
    next,
    prev,
}: {
    children: ReactNode;
    next?: () => void;
    prev?: () => void;
}) {
    return (
        <ContentAndButtons>
            <Content>{children}</Content>
            <Buttons>
                <NextButton disabled={!prev} title={"Forrige"} onPress={prev} />
                <NextButton
                    disabled={!next}
                    title={`Neste ${!next ? "" : "👉"}`}
                    onPress={next}
                />
            </Buttons>
        </ContentAndButtons>
    );
}

const ContentAndButtons = styled.View`
    background-color: white;
    display: flex;
    flex: 1;
    padding-vertical: 30px;
    padding-horizontal: 30px;
`;

const Content = styled.View`
    flex: 1;
    align-items: center;
    display: flex;
`;

const Buttons = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;
const NextButton = styled.Button``;
