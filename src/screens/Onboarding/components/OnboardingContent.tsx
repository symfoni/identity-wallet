import React from "react";
import styled from "styled-components/native";

export function OnboardingContent({
    next,
    prev,
}: {
    next?: () => void;
    prev?: () => void;
}) {
    return (
        <Content>
            <Image />
            <Description />
            <Buttons>
                <NextButton
                    disabled={!prev}
                    title={"< Forrige"}
                    onPress={prev}
                />
                <NextButton disabled={!next} title={"Neste >"} onPress={next} />
            </Buttons>
        </Content>
    );
}

const Content = styled.View`
    background-color: white;
    display: flex;
    flex: 1;
    padding-bottom: 30px;
    padding-horizontal: 30px;
`;

const Image = styled.View`
    flex: 2;
`;
const Description = styled.View`
    flex: 1;
`;
const Buttons = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;
const NextButton = styled.Button``;
