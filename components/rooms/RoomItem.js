import React from "react";
import styled from "styled-components/native";
import useMe from "../../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation} from '@react-navigation/core';
import { gql, useQuery } from "@apollo/client";

const SEE_PET_PROFILE_QUERY = gql`
query seePetProfile($user_id: Int!) {
seePetProfile(user_id: $user_id) {
  user_id
  pet_image
}
}
`;

const RoomContainer = styled.TouchableOpacity`
  width:100%;
  padding: 15px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Data = styled.View``;
const UnreadDot = styled.View`
  width:10px;
  border-radius: 5px;
  height:10px;
  background-color: tomato;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 20px;
`;
const Username = styled.Text`
  font-weight: 600;
  font-size: 15;
`;
const UnreadText = styled.Text`
  margin-top: 2px;
  font-weight: 500;
`;

export default function RoomItem({ userdb, unreadTotal, id }) {
  const {data:meData} = useMe();
  const navigation = useNavigation();
  const talkingTo = userdb.find((userdb) => userdb.user_name !== meData?.me?.user_name);
  const goToRoom = () => navigation.navigate("Room", {
    id,
    talkingTo
  })
  const { data } = useQuery(SEE_PET_PROFILE_QUERY, {
    variables : {
        user_id: talkingTo.id,
    }
  });
  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatar source={{ uri: data?.seePetProfile?.pet_image }} />
        <Data>
          <Username>{talkingTo.user_name}</Username>
          <UnreadText>{unreadTotal} 개 읽지 않은 메세지가 있습니다</UnreadText>
        </Data>
      </Column>
      <Column>
        {unreadTotal !== 0 ? <UnreadDot/> : null}
      </Column>
    </RoomContainer>
  );
}