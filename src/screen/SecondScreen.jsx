import { View, Text, StyleSheet, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, Keyboard, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blackClr, brand, dimGreenClr, Logo, MACaddress, model, pinkClr, PoppinsBold, primaryClr, RobotoMedium, serialNum, token, whiteClr } from '../Common'
import {
  responsiveHeight, responsiveWidth, responsiveFontSize
} from "react-native-responsive-dimensions";
import Girl from "../../assets/myimg/girl.svg";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



const SecondScreen = ({ navigation }) => {
  // console.log(responsiveWidth(16.7))
  const [userphone, setUserPhone] = useState('');
  const [enterOTP, setenterOTP] = useState('');

  const [isRequested, setisRequested] = useState(false)
  const [verifyReq, setVerifyReq] = useState(false)
  const [showNextForm, setshowNextForm] = useState(false)
  const [confirm, setConfirm] = useState(null);
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);
  const [alreadyLogin, setalreadyLogin] = useState(firebase.auth().currentUser)

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 100 // keyboard



  useEffect(() => {
    // if user already logged in then redirect to Final Screen
    if (alreadyLogin) {
      navigation.replace('Final')
    }
  }, [])

  useEffect(() => {
    try {
      AsyncStorage.getItem('isLogin').then((res) => {
        if (res == 'Yes') {
          navigation.navigate('Final')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }, [])



  function showToast(typeToast, msg) {
    Toast.show({
      type: typeToast,
      text1: msg
    })
  }


  async function signInWithPhoneNumber() {
    const hasSpacesOrSymbols = /\s|[,.\-]/.test(userphone); // check if the string contains spaces or symbols
    if (hasSpacesOrSymbols) {
      showToast('error', 'Invalid Phone Number given ?');
    } else {
      if (userphone.length !== 10) {
        showToast('error', 'Please Enter 10 Digit Mobile Number');
      } else {
        try {
          setisRequested(!isRequested)
          const confirmation = await auth().signInWithPhoneNumber(`+91${userphone}`);
          if (confirmation) {
            setConfirm(confirmation);
            setisRequested(false)
            setshowNextForm(true)
          }
        } catch (error) {
          console.log('signInWithPhoneNumber Second Screen', error)
          Alert(error)
        }
      }
    }

  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    // console.log('state', user)
    setUser(user);
    if (initializing) setInitializing(false);
  }
  
  async function confirmCode() {
    try {
      if (enterOTP.length < 4) {
        showToast('error', 'Please Enter OTP ?');
      } else {
        var resp = await confirm.confirm(enterOTP);
        console.log(resp)
        if (resp) {
          showToast('success', 'OTP successfully Verify done.');
          firestore()
            .collection('Users').doc('userslistid')
            .set({allusers:{
              phone: user.phoneNumber,
              brand,
              MACaddress,
              serialNum,
              model,
              uid: user.uid}
            })
            .then(() => {
              console.log('User added!');
            });
          navigation.navigate('Final') // navigate to final
        }

      }
    } catch (error) {
      showToast('error', `Invalid Code ? OTP has sent on ${userphone}`);
      console.log('Invalid code.', error);
    }
  }




  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // console.log("subscriber", subscriber)
    return subscriber; // unsubscribe on unmount

  })

  console.log("user at Second Screen", user) // this may show undefine because of by default not setting user details in state

  return (
    <KeyboardAvoidingView behavior='padding' enabled keyboardVerticalOffset={keyboardVerticalOffset} style={{ flex: 1, backgroundColor: whiteClr, justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}>

      <View style={styles.logoView}>
        <Logo width={responsiveWidth(16.5)} height={responsiveWidth(16.5)} />
        <Text style={styles.logoUnderText}>Setup <Text style={{ color: primaryClr }}>Account</Text></Text>
      </View>

      {/* image  */}
      <View style={styles.imageBox}>
        <Girl width={responsiveWidth(80)} height={responsiveWidth(70)} />
      </View>

      <View style={styles.bottomContainer}>
        <View style={{ display: showNextForm ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <TextInput placeholder='Enter Mobile No.' style={styles.inputPhone} keyboardType='phone-pad' maxLength={10} onChangeText={(text) => setUserPhone(text)} />

          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber} disabled={isRequested}>
            <Text style={styles.buttonText}> Get OTP {isRequested ? <ActivityIndicator color={whiteClr} /> : <AntDesign name='unlock' style={styles.buttonIcon} />}</Text>
          </TouchableOpacity >
        </View>

        {/* ****** dispaly after successfully sent otp  ::: default none after set 'flex' */}
        <View style={{ display: showNextForm ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}>
          <TextInput placeholder='Enter OTP ' keyboardType='phone-pad' style={[styles.inputPhone, { textAlign: 'center', fontWeight: '800' }]} onChangeText={(text) => setenterOTP(text)} />
          <TouchableOpacity style={[styles.button, { backgroundColor: dimGreenClr }]} onPress={confirmCode}>
            <Text style={styles.buttonText}> Verify OTP {verifyReq ? <ActivityIndicator color={whiteClr} /> : <AntDesign name='unlock' style={[styles.buttonIcon, { color: primaryClr }]} />}</Text>
          </TouchableOpacity >
        </View>

      </View>

      <Toast topOffset={1} />
    </KeyboardAvoidingView  >
  )
}
const styles = StyleSheet.create({
  logoView: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoUnderText: {
    fontSize: responsiveFontSize(3.1),
    fontFamily: PoppinsBold,
    color: blackClr
  },
  imageBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(100)
  },
  bottomContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: pinkClr,
    height: responsiveHeight(35),
    borderTopLeftRadius: responsiveHeight(19)
  },
  inputPhone: {
    borderWidth: 2,
    borderColor: primaryClr,
    borderRadius: responsiveWidth(5),
    width: responsiveWidth(70),
    fontSize: responsiveFontSize(2.2),
    padding: responsiveWidth(1.4),
    backgroundColor: whiteClr,
    paddingLeft: 5
  },
  button: {
    marginTop: responsiveWidth(2),
    backgroundColor: primaryClr,
    width: responsiveWidth(40),
    height: responsiveHeight(6),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: responsiveHeight(5),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: whiteClr,
    fontSize: responsiveWidth(5.4),
    fontFamily: RobotoMedium,
    letterSpacing: 0.6
  },
  buttonIcon: {
    color: dimGreenClr,
    fontSize: responsiveWidth(6),

  }
})
export default SecondScreen