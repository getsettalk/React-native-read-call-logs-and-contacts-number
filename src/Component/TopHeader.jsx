import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Button, Easing } from 'react-native'
import React, { useState } from 'react'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { blackClr, Logo, mutedClr, pinkClr, primaryClr, whiteClr } from '../Common';
import AntDesign from 'react-native-vector-icons/AntDesign'
import firebase from "@react-native-firebase/app";
import { useNavigation } from '@react-navigation/native';


const TopHeader = (props) => {
  const [alreadyLogin, setalreadyLogin] = useState(firebase.auth().currentUser)
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(firebase.auth().currentUser)
  const navigation = useNavigation();

  // console.log('TopHeader.jsx', user)


  function CheckLoginAuth() {
    // is still user logged in 
    // if not then replace Second Screen
    if (!alreadyLogin) {
      console.log('user is not logged in redirect')
      navigation.replace('Second')
    }
  }
  CheckLoginAuth() // this will check every time


  const handleLogout = () => {
    console.log('logging out...')
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Remove user credentials from state or AsyncStorage
        setUser(null);
        console.log('logout')
        navigation.replace('Second')
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={styles.HeaderBox}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Logo width={responsiveWidth(15)} height={responsiveWidth(15)} />
      </TouchableOpacity>
      <TextInput style={styles.SearchBar} placeholder={props.tabname == 'Contacts' ? 'Search by name' : 'Seach by number'} onChangeText={(text) => props.searchFun(text)} />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100), backgroundColor: whiteClr, }}>
          <View style={styles.modalBody}>
            <Text>Your Mobile : {user && user.phoneNumber}</Text>
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Text style={{ color: 'red' }}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{ color: 'red' }}> <AntDesign name='closecircleo' size={responsiveFontSize(4.5)} /> </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  HeaderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(2),
    shadowColor: blackClr,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    padding: 5,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 2,
    backgroundColor: pinkClr,
    borderRadius: responsiveWidth(2),
  },
  SearchBar: {
    borderWidth: 1,
    borderColor: primaryClr,
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(75),
    padding: responsiveWidth(1),
    backgroundColor: whiteClr
  },
  modalBody: {
    padding: responsiveFontSize(2),
    width: responsiveWidth(80),
    height: 'auto',
    backgroundColor: whiteClr,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  button: {
    position: 'absolute',
    top: -10,
    right: -5
  },

  logout: {
    borderRadius: 20,
    padding: 7,
    elevation: 2,
    backgroundColor: pinkClr,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(20),
    marginTop: 10

  }
})
export default TopHeader