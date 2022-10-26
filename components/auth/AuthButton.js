import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

const Button = styled.TouchableOpacity`
    text-align: center;
    margin-left: 110px;
    margin-right: 110px;

    margin-top : 10px;
    background-color:#ffc477;
    padding: 9px 5px;
    border-radius: 9px;
    border:1px solid #eeb44f;
    shadowOpacity: 0.35,
    shadowRadius: 3.5,
    opacity:${(props) => (props.disabled ? "0.5":"1")};
`;
const ButtonText = styled.Text`
    text-align: center;
    font-weight:500;
    font-size:40px;
`;

export default function AuthButton({onPress,disabled,text,loading}){
    return ( 
    <Button disabled={disabled} onPress={onPress}>
        {loading ? (<ActivityIndicator color="black"/>)  : (<ButtonText>{text}</ButtonText>)}
    
    </Button>
    );
}