import React,{ useEffect, useState } from 'react';
import { View, Text, Button, TextInput,Image,ToastAndroid, Alert,TouchableOpacity,StyleSheet,PermissionsAndroid } from 'react-native';
import {Signup,Home_Style} from "../../style.js"
import { openDatabase } from 'react-native-sqlite-storage';
import wifi from "react-native-wifi-reborn"
import androidwifi from "react-native-android-wifi"
import Modal from "react-native-modal";
import { ScrollView } from 'react-native-gesture-handler';
import BackgroundService from 'react-native-background-actions';
import { jsonToCSV } from 'react-native-csv'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import { response } from 'express';
import AsyncStorage from '@react-native-async-storage/async-storage';

// DA251D - redtam
// FFFFFF - whitetam
// 222222 - blacktam

function AfterLogin(props) {


  const [list, setList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [InpPass, setInpPass] = useState("");
  const [InpSSID, setInpSSID] = useState("");
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  
useEffect(()=>{
androidwifi.loadWifiList((wifiStringList) => {
  var wifiArray = JSON.parse(wifiStringList);
  // console.log("WIFI",wifiArray)
  setList(wifiArray)
    // console.log("slslxsxn",wifiArray);
  },
  (error) => {
    console.log(error);
  }
);

},[list])


 const pressed=()=>{
wifi.loadWifiList().then((l)=>console.log("newlist",l))

androidwifi.loadWifiList((wifiStringList) => {
  var wifiArray = JSON.parse(wifiStringList);
    console.log("slslxsxn",wifiArray);
  },(error) => {
    console.log("error",error);
  })

 }
  // _____WIFI_____
  const openToggle=(SSID)=>{
    androidwifi.setEnabled(false)
    setInpSSID(SSID)
    toggleModal()

  }

  const onConnected=()=>{
    if(InpPass!=""){
      // console.log("inside")
    wifi.connectToProtectedSSID(InpSSID, InpPass, true).then(
      () => {
        
        console.log("Connected successfully!");
        ToastAndroid.show("Connected",ToastAndroid.SHORT)
        setInpPass("")
        toggleModal()
      },
      () => {
        console.log("Connection failed!");
      }
    );}
    else{
      ToastAndroid.show("Enter Password",ToastAndroid.SHORT)
    }

  }

const LogOut = async () =>{
  await AsyncStorage.setItem("UserEmail","")
      await AsyncStorage.setItem("UserName","")
      await AsyncStorage.setItem("UserPass","")
      ToastAndroid.show("Successfully LogoOut",ToastAndroid.SHORT)
      props.navigation.navigate("Login")

}
 
    return(
      <View style={{ marginTop:"5%",marginBottom:"25%" }}>
<View style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",marginBottom:"5%"}}>
      <TouchableOpacity onPress={()=>{props.navigation.navigate("Profile")}}>
        <Image style={{width: 40, height: 40}} source={require("../assets/User-Profile-PNG-High-Quality-Image.png")}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{LogOut()}}>
        <Image style={{width: 40, height: 40,marginLeft:"5%"}} source={require("../assets/logout.png")}/>
        </TouchableOpacity>
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 32,textAlign:"center",marginBottom:"5%", color: "#DA251D" }}>All Wifi Networks</Text>

<ScrollView>
      {list.map((e, i) => {
        return (
          <TouchableOpacity onPress={()=>{openToggle(e.SSID)}} key={i} style={{borderColor:"#DA251D",padding:"3%",margin:"2%", borderWidth:3,}}>
            <Text style={{color:"#222222",fontSize:20, fontWeight:"bold", textAlign:"center"}}>{e.SSID}</Text>
          </TouchableOpacity>
        )
      })}
    
      </ScrollView>
      <Button title="disconnect" color="#DA251D" onPress={() =>androidwifi.setEnabled(false)} />





      <View style={{ marginTop: 10 }}>
        <Modal isVisible={isModalVisible}>
          <View style={{ margin: 20, padding: 20, }}>
            <TextInput keyboardType="visible-password" placeholder="Password" value={InpPass} onChangeText={(e) => setInpPass(e)} />
            <Button title="Connect" onPress={() => onConnected()} />
            <View style={{marginTop:20}} >
            <Button title="Close" onPress={() => toggleModal()} />

            </View>
          </View>
        </Modal>
      </View>

    </View>
     
    )

}

 
export default AfterLogin
