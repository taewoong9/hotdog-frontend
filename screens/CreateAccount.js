import React, { useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
// import { TextInput } from "../components/auth/AuthShared";
import { TextInput } from 'react-native-paper';
import {StyleSheet} from 'react-native';
const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount(
        $user_id: String!
        $user_pw: String!
        $user_name: String!
        $user_birth: String!
        $user_gender: String!
        $user_phone: String!
        $user_address: String!
    ) {
        createAccount(
            user_id: $user_id
            user_pw: $user_pw
            user_name: $user_name
            user_birth: $user_birth
            user_gender: $user_gender
            user_phone: $user_phone
            user_address: $user_address
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
export default function CreateAccount({ navigation }) {
    const { register, handleSubmit, setValue, getValues } = useForm();
    const onCompleted = (data) => {
        const { createAccount: { ok },
        } = data;
        const { user_id, user_pw } = getValues();
        if (ok) {
            navigation.navigate("CreatePet", {
                user_id,
                user_pw
            })
        }
    };
    const [createAccountMutation, { loading }] = useMutation(
        CREATE_ACCOUNT_MUTATION,
        {
            onCompleted,
        }
    );
    const passwordRef = useRef();
    const nameRef = useRef();
    const phoneRef = useRef();
    const sexRef = useRef();
    const birthRef = useRef();
    const addressRef = useRef();
    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    }
    const onValid = (data) => {
        if (!loading) {
            createAccountMutation({
                variables: {
                    ...data,
                }
            });
        }
    };
    useEffect(() => {
        register("user_id", {
            required: true,
        });
        register("user_pw", {
            required: true,
        });
        register("user_name", {
            required: true,
        });
        register("user_birth", {
            required: true,
        });
        register("user_gender", {
            required: true,
        });
        register("user_phone", {
            required: true,
        });
        register("user_address", {
            required: true,
        });
    }, [register])
    return (
        <AuthLayout>
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" autoFocus placeholder="아이디" returnKeyType="next" onSubmitEditing={() => onNext(passwordRef)} onChangeText={(text) => setValue("user_id", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={passwordRef} placeholder="패스워드" returnKeyType="next" secureTextEntry onSubmitEditing={() => onNext(nameRef)} onChangeText={(text) => setValue("user_pw", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={nameRef} placeholder="닉네임" autoCapitalize={"none"} returnKeyType="next" onSubmitEditing={() => onNext(phoneRef)} onChangeText={(text) => setValue("user_name", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={birthRef} placeholder="생년월일: 예) 970307" returnKeyType="next" keyboardType="number-pad" onSubmitEditing={() => onNext(addressRef)} onChangeText={(text) => setValue("user_birth", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={sexRef} placeholder="성별: 예) 남, 여" returnKeyType="next" onSubmitEditing={() => onNext(birthRef)} onChangeText={(text) => setValue("user_gender", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={phoneRef} placeholder="전화번호: 예) 01012346789" returnKeyType="next" keyboardType="number-pad" onSubmitEditing={() => onNext(sexRef)} onChangeText={(text) => setValue("user_phone", text)} />
            <TextInput style={styles.input} theme={{ roundness: 25  }} mode="outlined" placeholderTextColor="rgba(0,0,0,3.0)" ref={addressRef} placeholder="주소: 예) 충주시 모시래2길 00-00" returnKeyType="done" onSubmitEditing={handleSubmit(onValid)} onChangeText={(text) => setValue("user_address", text)} />
            <AuthButton text="다음" disabled={false} onPress={handleSubmit(onValid)} />
        </AuthLayout>
    );
}