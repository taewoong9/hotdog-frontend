import { gql, useQuery } from "@apollo/client";
import React, {useEffect} from "react";
import { StyleSheet, View, Text, Animated, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components";
import Geocoder from 'react-native-geocoding';
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { markers } from "../model/mapData";
import { Platform } from "expo-modules-core";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const MATCHING_USERS = gql`
  query seeProfile($user_name: String!) {
    seeProfile(user_name: $user_name) {
      user_name
      user_address
      user_gender
    }
  }
`;

Geocoder.init("AIzaSyDSWoaTjXyC_3IXeas1RKZhBfdHbDrEAUo");

var location
const user1 = "taewoong9"
const user2 = "yongJun97"
const user3 = "woo2020"

const index = ({ navigation }) => {
  const {data:data1} = useQuery(MATCHING_USERS,{
    variables: {
      user_name: user1
    }
  });
  const {data:data2} = useQuery(MATCHING_USERS,{
    variables: {
      user_name: user2
    }
  });
  const {data:data3} = useQuery(MATCHING_USERS,{
    variables: {
      user_name: user3
    }
  });
  console.log(data1?.seeProfile?.user_address);
  const address1 = data1?.seeProfile?.user_address
  // console.log(data2?.seeProfile?.user_address);
  const address2 = data2?.seeProfile?.user_address
  // console.log(data3?.seeProfile?.user_address);
  const address3 = data3?.seeProfile?.user_address
  const usermarker1 = Geocoder.from(address1)
      .then(json => {
        location = json.results[0].geometry.location;
        console.log(location);
        return location
      })
      .catch(error => console.warn(error));
  const usermarker2 = Geocoder.from(address2)
      .then(json => {
        location = json.results[0].geometry.location;
        // console.log(location);
        return location
      })
      .catch(error => console.warn(error));
  const usermarker3 = Geocoder.from(address3)
      .then(json => {
        location = json.results[0].geometry.location;
        // console.log(location);
        return location
      })
      .catch(error => console.warn(error));
  // const [initialRegion, setInitialRegion] = useState({
  //   latitude: 35.91395373474155,
  //   longitude: 127.73829440215488,
  //   latitudeDelta: 3,
  //   longitudeDelta: 3,
  // })
  
const initialMapState = {
  markers,
  region: {
    latitude: 35.91395373474155,
    longitude: 127.73829440215488,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,    
  }
};

const [state, setState] = React.useState(initialMapState);

let mapIndex = 0;
let mapAnimation = new Animated.Value(0);

useEffect(() => {
  mapAnimation.addListener(({ value }) => {
    let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    if (index >= state.markers.length) {
      index = state.markers.length - 1;
    }
    if (index <= 0) {
      index = 0;
    }

    clearTimeout(regionTimeout);

    const regionTimeout = setTimeout(() => {
      if( mapIndex !== index ) {
        mapIndex = index;
        const { coordinate } = state.markers[index];
        _map.current.animateToRegion(
          {
            ...coordinate,
            latitudeDelta: state.region.latitudeDelta,
            longitudeDelta: state.region.longitudeDelta,
          },
          350
        );
      }
    }, 10);
  });
});

const interpolations = state.markers.map((marker, index) => {
  const inputRange = [
    (index - 1) * CARD_WIDTH,
    index * CARD_WIDTH,
    ((index + 1) * CARD_WIDTH),
  ];

  const scale = mapAnimation.interpolate({
    inputRange,
    outputRange: [1, 1.5, 1],
    extrapolate: "clamp"
  });

  return { scale };
});

const onMarkerPress = (mapEventData) => {
  const markerID = mapEventData._targetInst.return.key;

  let x = (markerID * CARD_WIDTH) + (markerID * 20); 
  if (Platform.OS === 'ios') {
    x = x - SPACING_FOR_CARD_INSET;
  }

  _scrollView.current.scrollTo({x: x, y: 0, animated: true});
}

const _map = React.useRef(null);
const _scrollView = React.useRef(null);

  return (
    <Wrapper>
      <MapView
        ref={_map}
        initialRegion={state.region}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {state.markers.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          return (
            <MapView.Marker key={index} coordinate={marker.coordinate} onPress={(e)=>onMarkerPress(e)}>
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={require('../assets/map_marker.png')}
                  style={[styles.marker, scaleStyle]}
                  resizeMode="cover"
                />
              </Animated.View>
            </MapView.Marker>
          );
        })}
{/*     
    <MapView.Marker coordinate={{latitude: 36.9898457, longitude: 127.9416935}}/>
    <MapView.Marker coordinate={{latitude: 36.9898457, longitude: 127.9253943}}/>
    <MapView.Marker coordinate={{latitude: 36.9716796, longitude: 127.9253943}}/> */}
    </MapView>
    <Animated.ScrollView 
      ref={_scrollView}
      horizontal
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      pagingEnabled
      snapToInterval={CARD_WIDTH + 20}
      snapToAlignment="center"
      contentInset={{
        top: 0,
        left: SPACING_FOR_CARD_INSET,
        bottom: 0,
        right: SPACING_FOR_CARD_INSET,
      }}
      contentContainerStyle={{
        paddingHorizontal: Platform.OS == "android" ? SPACING_FOR_CARD_INSET : 0
      }}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: mapAnimation,
              }
            },
          },
        ],
        {useNativeDriver: true}
      )}
    >
      {state.markers.map((marker, index) =>(
        
          <View style={styles.card} key={index}>
            <Image 
              source={marker.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
              <Text numberOfLines={1} style={styles.cardDescription}>{marker.description}</Text>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile",{
                    user_name:'taewoong9'
                  })}
                  style={[styles.signIn, {
                    borderColor: '#FF6347',
                    borderWidth: 1
                  }]}
                >
                  <Text style={[styles.textSign, {
                    color: '#FF6347'
                  }]}>프로필 보러가기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
    </Animated.ScrollView>
    </Wrapper>
  );
};

export default index;

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
`;

const styles = StyleSheet.create({
  map: {
  	flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  signIn: {
    width: '100%',
    padding:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width:50,
    height:50,
  },
  marker: {
    width: 30,
    height: 30,
  },
});