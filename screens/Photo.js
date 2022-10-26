import React, { useState } from "react";
import { gql } from "@apollo/client/core";
import { PHOTO_FRAGMENT } from "../fragments";
import { Text, TouchableOpacity, View, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@apollo/client/react/hooks";
import ScreenLayout from "../components/ScreenLayout";
import Photo from "../components/Photo";




const SEE_PHOTO = gql`
    query seePost($id: Int!) {
        seePost(id:$id) {
            ...PhotoFragment
            userdb {
                id
                user_name
            }
            post_content
        }
    }
    ${PHOTO_FRAGMENT}
`;

export default function PhotoScreen({route}) {
    const {data, loading, refetch} = useQuery(SEE_PHOTO, {
        variables: {
            id: route?.params?.photoId,
        },
    });
    const [refreshing, setRefreshing] = useState();
    const onRefresh = async() => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <ScreenLayout loading={loading}>
             <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refreshing}   
                    />
                }
                style={{ backgroundColor: "white" }}
                contentContainerStyle={{ 
                    backgroundColor: "white", 
                    flex: 1, 
                    alignItems: "center", 
                    justifyContent: "center"
                }}
                >
                <Photo {...data?.seePost} />
            </ScrollView>
        </ScreenLayout>
    );
}