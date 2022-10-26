import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";

const SEE_PET_PROFILE_QUERY = gql`
query seePetProfile($user_id: Int!) {
seePetProfile(user_id: $user_id) {
  user_id
  pet_name
  pet_age
  pet_gender
  pet_image
  pet_kinds
}
}
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`;
const Column = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    
`;
const Username = styled.Text`
    font-weight: 600;
    padding: 15px 15px;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`;




export default function UserRow({ id, user_name }) {
    const { data } = useQuery(SEE_PET_PROFILE_QUERY, {
        variables : {
            user_id: id,
        }
      }); 
    const navigation = useNavigation();
    return (
        <Wrapper>
            <Column onPress={() => navigation.navigate("Profile", {
                user_name,
                id,
            })}>
                <Avatar source={{ uri: data?.seePetProfile?.pet_image }} />
                <Username>{user_name}</Username>
            </Column>
        </Wrapper>
    );
}