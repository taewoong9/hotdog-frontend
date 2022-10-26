import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";

const Column = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const Avatar = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin-right: 10px;
`;
const Username = styled.Text`
    font-weight: 600;
    color: white; 
`;
const Payload = styled.Text`
    font-weight: 400;
    color: black; 
`;


const Wrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 15px;
`;

export default function CommentRow({ content }) {
    const navigation = useNavigation();
    return (
        <Wrapper>    
            <Column 

                // onPress={() => navigation.navigate("Profile", {
                //     username, 
                //     id,
                //     }) 
                // }
            >
                {/* 
                <Avatar source={{uri: avatar}} />
                <Username>{username}</Username>
                 */}
                 <Payload>{content}</Payload>
            </Column>
            
        </Wrapper>
    );
}