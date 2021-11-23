import React, { ReactNode } from "react";
import styled from "styled-components/native";

export function OnboardingContent({
    children,
    index,
    next,
    prev,
}: {
    children: ReactNode;
    // From 1-4
    index: number;
    next?: () => void;
    prev?: () => void;
}) {
    return (
        <ContentAndButtons>
            <Content>{children}</Content>
            <Dots>
                <Dot big={index === 1}>•</Dot>
                <Dot big={index === 2}>•</Dot>
                <Dot big={index === 3}>•</Dot>
                <Dot big={index === 4}>•</Dot>
            </Dots>
            <Buttons>
                <NextButton disabled={!prev} title={"Forrige"} onPress={prev} />
                <NextButton disabled={!next} title={"Neste"} onPress={next} />
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

const Dots = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 15px;
`;
const Dot = styled.Text`
    margin-horizontal: 1px;
    ${(props: { big: boolean }) =>
        props.big ? "font-size: 20px;" : "font-size: 14px;"};
    ${(props: { big: boolean }) =>
        props.big ? "opacity: 1;" : "opacity: 0.3;"};
`;

const Buttons = styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

const NextButton = styled.Button`
    min-width: 300px;
    height: 44px;
`;
