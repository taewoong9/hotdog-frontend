import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TabIcons from "../components/auth/nav/TabIcon";
import StackNavFactory from "../components/auth/nav/StackNavFactory";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';



const Tabs = createBottomTabNavigator()

export default function TabsNav(){
    return (
    <Tabs.Navigator
            screenOptions={{headerShown:false,tabBarStyle: {
                //backgroundColor: '#E49E49', // 밝은순서 FF9933(2) FF9966(1) FF9900(3) CC6633(4)
                borderTopColor: 'black',
                //borderBottomWidth: 1,
            }}}
            tabBarOptions={{
            showLabel:false,
        }}
    >
        <Tabs.Screen 
            name="Feed" 
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name="home" size={24} color={color}/>
                )
            }}
        >
            {() => <StackNavFactory screenName="Feed" />}
        </Tabs.Screen>
        <Tabs.Screen 
            name="Messages" 
            options={{
                tabBarStyle:{display:'none'},
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name="chatbubble-outline" size={25} color={color}/>
                )
            }}    
        >
            {() => <StackNavFactory screenName="Messages" />}
        </Tabs.Screen>
        <Tabs.Screen 
            name="Mathcing" 
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <FontAwesome5 name="dog" size={24} color={color} />
                )
            }} 
        >
            {() => <StackNavFactory screenName="Matching" />}
        </Tabs.Screen>
        <Tabs.Screen 
            name="Me" 
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name="md-person-circle-sharp" size={33} color={color} />
                )
            }} 
        >
            {() => <StackNavFactory screenName="Me" />}
        </Tabs.Screen>
    </Tabs.Navigator>
    );
}