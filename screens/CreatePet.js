import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
// import { TextInput } from "../components/auth/AuthShared";
import { ReactNativeFile } from "apollo-upload-client";
import { interpolate } from "react-native-reanimated";
import { TextInput } from 'react-native-paper';
import {StyleSheet} from 'react-native';
import styled from "styled-components/native";
import { configureProps } from "react-native-reanimated/lib/reanimated2/core";



const CREATE_PET_MUTATION = gql`
    mutation createPet(
        $pet_name: String!
        $pet_age: String!
        $pet_gender: String!
        $pet_kinds: String!
        $pet_image: Upload!
    ) {
        createPet(
            pet_name: $pet_name
            pet_age: $pet_age
            pet_gender: $pet_gender
            pet_kinds: $pet_kinds
            pet_image: $pet_image
        ) {
            ok
            error
        }
    }
`;
const styles = StyleSheet.create({
    input: {
      height: 28,
      margin: 5,
      marginLeft: 15,
      marginRight: 15,
      padding: 8,
    },
});
const Button = styled.TouchableOpacity`
justify-content: center;
padding: 10px 20px;
border-radius: 12px;
margin-top: 20px;
margin-left: 130px;
margin-bottom: 10px;
width: 150px;
background-color:#ffc477;

`;


export default function CreatePet({route,navigation}){
    console.log(route)
    const { register, handleSubmit, setValue, getValues } = useForm();
    const onCompleted = (data) => {
        const { createPet: { ok },
        } = data;
        const { user_id, user_pw } = getValues();
        if (ok) {
            navigation.navigate("LogIn", {
                user_id,
                user_pw
            })
        }
    };
    const [createPetMutation, { loading }] = useMutation(
        CREATE_PET_MUTATION,
        {
            onCompleted,
        }
    );
    const nameRef = useRef();
    const sexRef = useRef();
    const ageRef = useRef();
    const kindRef = useRef();
    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    }
    const onValid = ({pet_name,pet_age,pet_gender,pet_kinds}) => {
        const pet_image = new ReactNativeFile({
            uri: route.params.pet_image,
            name: `1.jpg`,
            type: 'images/jpg',
          });        
          console.log(pet_image)
        if (!loading) {
            createPetMutation({
                variables: {
                    pet_name,
                    pet_age,
                    pet_gender,
                    pet_kinds,
                    pet_image
                }
            });
        }
    };
    useEffect(() => {
        register("pet_name", {
            required: true,
        });
        register("pet_age", {
            required: true,
        });
        register("pet_gender", {
            required: true,
        });
        register("pet_kinds", {
            required: true,
        });
    }, [register]);
    return (
        <AuthLayout>
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={nameRef} placeholder="반려동물 이름" autoCapitalize={"none"} returnKeyType="next" onSubmitEditing={() => onNext(ageRef)} onChangeText={(text) => setValue("pet_name", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={ageRef} placeholder="반려동물 나이" returnKeyType="next" keyboardType="number-pad" onSubmitEditing={() => onNext(sexRef)} onChangeText={(text) => setValue("pet_age", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={sexRef} placeholder="반려동물 성별" returnKeyType="next" onSubmitEditing={() => onNext(kindRef)} onChangeText={(text) => setValue("pet_gender", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={kindRef} placeholder="반려동물 종" returnKeyType="next" onChangeText={(text) => setValue("pet_kinds", text)} />
            {/* <TouchableOpacity onPress={() => navigation.navigate("SelectPetPhoto")}><Text >반려동물 사진</Text></TouchableOpacity> */}
            <Button onPress={() => navigation.navigate("SelectPetPhoto")}>
                  <Text style={{ textAlign: "center" , fontSize: 20}}>반려동물 사진</Text>
            </Button>
            <Image resizeMode="center" source={{ uri: route?.params?.pet_image }} style={{height: 200}}/>
            <AuthButton text="회원가입" disabled={false} onPress={handleSubmit(onValid)} />
        </AuthLayout>
    );
}