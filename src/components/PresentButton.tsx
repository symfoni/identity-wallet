import React, { ReactNode } from "react";
import styled from "styled-components/native";

export function PresentButton({
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
