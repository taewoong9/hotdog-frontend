import React from "react";
import SelectPhoto from "../screens/SelectPhoto";
import { createStackNavigator } from "@react-navigation/stack";
import UploadForm from "../screens/UploadForm"

const Stack = createStackNavigator();

export default function UploadNav() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: "#ffc477",
                borderBottomWidth: 1,
                borderBottomColor: 'black',
             },
        //     headerBackTitleVisible: false,
        //     headerTintColor:"black",
            headerTitleAlign: 'center',
            headerTitle:"🐶 HOT DOG 🐩",
            
            headerTitleStyle: {
                fontWeight: '400',
                color: '#e74c3c',    
                fontSize: 20
            }
        //     headerTransparent:true,
        }}>
            <Stack.Screen name="Select" component={SelectPhoto}></Stack.Screen>
            <Stack.Screen name="UploadForm" component={UploadForm}></Stack.Screen>
        </Stack.Navigator>
    );
}