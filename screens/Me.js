import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, useWindowDimensions, FlatList, StyleSheet } from "react-native";
import useMe from "../hooks/useMe";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";


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
flex-direction: row;  
`;

const Username2 = styled.Text`
  font-size: 30px;
  font-weight: 500;
  padding: 10px 10px;
  marginLeft: -165px;
  marginTop: -180px;
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

export default function Me({navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async() => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    const { data } = useMe();
    const { data:pdata } = useQuery(SEE_PET_PROFILE_QUERY, {
        variables : {
            user_id: data?.me?.id,
        }
      }); 
    const { data:ppdata, refetch } = useQuery(SEE_PROFILE_QUERY, {
      variables : {
        user_name: data?.me?.user_name,
      },
    });
    useEffect(() => {
        navigation.setOptions({
            title: data?.me?.user_name,
        });
    }, []);
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
                source={{uri: photo.post_images }}
                style={{width: width / numColumns, height:100}}
            />
        </TouchableOpacity>
    );
    return (
        <Container>
            <View style = {{alignItems: 'center', marginTop: 30, flexDirection: 'row'}}>
                <Avatar source={{ uri: pdata?.seePetProfile?.pet_image}} /> 
                <Username style={{ 
                    
                    textAlign: "center",
                    width: 250, height: 140,  marginTop: 180,marginStart:-60, backgroundColor: '#FAEBCD' ,
                    margin:2,
                    marginLeft: 10,
                    marginRight: 10,
                    padding: 3,
                    textAlign: "center",
                    borderRadius: 13,
                    overflow: "hidden",
                      }}>
                    <View>
                      <Text style={styles.input}>반려동물 이름:{pdata?.seePetProfile?.pet_name}</Text>
                      <Text style={styles.input}>나이: {pdata?.seePetProfile?.pet_age}살</Text>
                      <Text style={styles.input}>반려동물 성별: {pdata?.seePetProfile?.pet_gender}</Text>
                      <Text style={styles.input}>종: {pdata?.seePetProfile?.pet_kinds}</Text>
                      <Text style={styles.input}>사는 곳: {data?.me?.user_address}</Text>
                    </View>
                  </Username>  
                      <Username2 style={{textAlign: "center",}}> {data?.me?.user_name}</Username2>            
            
            </View>

            <View style = {{ marginTop: 20 }}>  
            <View style={{ width: 700, height: 1.23, borderRadius:10, marginTop: 6, backgroundColor: 'black' }}></View>
                <FlatList 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    numColumns={4}
                    data={ppdata?.seeProfile?.postdb}
                    keyExtractor={photo => "" + photo.id}
                    renderItem={renderItem}
                    inverted
                />
            </View>

        </Container>
    );
}