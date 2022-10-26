import React, {useEffect} from "react";
import { Text, View, FlatList, useWindowDimensions, TouchableOpacity, Image, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";
import { logUserOut } from "../apollo";
import { useForm } from "react-hook-form";
import useMe from "../hooks/useMe";

const SEE_PROFILE_QUERY = gql`
  query seeProfile($user_name: String!) {
    seeProfile(user_name: $user_name) {
      id
      user_name
      user_address
      postdb {
        ...PhotoFragment
      }
    }
  }
  ${PHOTO_FRAGMENT}
`;

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

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage (
      $content: String!
      $chatroom_id: Int
      $user_id: Int
  ){
      sendMessage(
        content: $content
        chatroom_id: $chatroom_id
        user_id: $user_id
      ){
          ok
          id
      }
  }
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Avatar = styled.Image` 
  width: 150px;
  height: 150px;
  border-radius: 80px;
  marginLeft: 5px;
  marginTop: -150px;
  borderColor: 'rgb(255, 153, 000)',
  borderWidth: 3,
`;

const Username = styled.Text`
  font-size: 20px;
  font-weight: 300;
  padding: 10px 10px;
  marginLeft: 35px;
  marginTop: -35px;
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px 20px;
  border-radius: 12px;
  marginTop: -80px;
  width: 150px;
  background-color:#ffc477;
  marginLeft: -140px;
`;

const Username2 = styled.Text`
  font-size: 30px;
  font-weight: 500;
  padding: 10px 10px;
  marginLeft: -160px;
  marginTop: -210px;
`;

const styles = StyleSheet.create({
  input: {
    height: 22,
    margin: 2,
    marginLeft: 10,
    marginRight: 10,
    padding: 3,
    textAlign: "center",
    marginTop: 3,      
  },
});

logUserOut();

export default function Profile({ navigation, route }) {
    const { data } = useQuery(SEE_PROFILE_QUERY, {
        variables : {
          user_name: route.params.user_name,
        },
    });
    const { data:pdata } = useQuery(SEE_PET_PROFILE_QUERY, {
      variables : {
          user_id: data?.seeProfile?.id,
      }
    }); 
    const { width } = useWindowDimensions();
    const numColumns = 4;
    const renderItem = ({item:photo}) => (
      <TouchableOpacity 
          onPress={() => 
              navigation.navigate("Photo", {
                  photoId: photo.id,
              })
          }
      >
          <Image 
              source={{uri: photo.post_images}}
              style={{width: width / numColumns, height:100}}
          />
      </TouchableOpacity>
    );

    useEffect(() => {
        if (route?.params?.user_name) {
            navigation.setOptions({
                title: route.params.user_name,
            });
        }
    }, []);
    const { data: meData } = useMe();
    const { register, setValue, handleSubmit } = useForm();
    setValue("message", `${meData?.me?.user_name}님이 채팅을 보내셨습니다`);
  
    const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
      SEND_MESSAGE_MUTATION,
    );
  
    const onValid = ({ message }) => {
      if (!sendingMessage) {
          sendMessageMutation({
              variables: {
                  content: message,
                  user_id: route?.params?.id,
              },
          });
      }
    };
  
    useEffect( () => {
      register("message", { required: true });
    }, [register]);
    return (
    <Container>
        <View style = {{alignItems: 'center', marginTop: 30, flexDirection: 'row'}}>
          <Avatar source={{ uri: pdata?.seePetProfile?.pet_image}} /> 
          <Username style={{ 
                    textAlign: "center",
                    width: 230, height: 140,  marginTop: 180,marginStart:-55, backgroundColor: '#FAEBCD' ,
                    margin:2,
                    marginLeft: 10,
                    marginRight: 10,
                    padding: 3,
                    textAlign: "center",
                    borderRadius: 13,
                    overflow: "hidden"
                    }}
          >
            <View>
              <Text style={styles.input}>반려동물 이름:{pdata?.seePetProfile?.pet_name}</Text>
              <Text style={styles.input}>나이: {pdata?.seePetProfile?.pet_age}살</Text>
              <Text style={styles.input}>반려동물 성별: {pdata?.seePetProfile?.pet_gender}</Text>
              <Text style={styles.input}>종: {pdata?.seePetProfile?.pet_kinds}</Text>
              <Text style={styles.input}>사는 곳: {data?.seeProfile?.user_address}</Text>
            </View>
          </Username>
          <Button loading={sendingMessage} onPress={handleSubmit(onValid)}>
            <Text style={{ textAlign: "center" , fontSize: 20}} onPress={() => navigation.navigate("Rooms")}>채팅</Text>
          </Button>
          <Username2 style={{textAlign: "center",}}> {data?.seeProfile?.user_name}</Username2>  
        </View>
        <View style = {{ marginTop: 20 }}>  
        <View style={{ width: 700, height: 1.23, borderRadius:10, marginTop: 6, backgroundColor: 'black' }}></View>
          <FlatList 
            numColumns={4}
            data={data?.seeProfile?.postdb}
            keyExtractor={photo => "" + photo.id}
            renderItem={renderItem}
            inverted
          />
        </View>
    </Container>
    );
}