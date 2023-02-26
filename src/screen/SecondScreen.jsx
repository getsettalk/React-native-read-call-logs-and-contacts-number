import { View, Text, StyleSheet, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blackClr, brand, dimGreenClr, Logo, MACaddress, model, pinkClr, PoppinsBold, primaryClr, RobotoMedium, serialNum, token, whiteClr } from '../Common'
import {
  responsiveHeight, responsiveWidth, responsiveFontSize
} from "react-native-responsive-dimensions";
import Girl from "../../assets/myimg/girl.svg";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


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

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 100 // keyboard

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
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
      navigation.navigate('Final')
    } catch (e) {
      console.log("Storing Localdata Error", e)
    }
  }

  // function submitPhoneNumberBTN() {
  //   if (userphone.length !== 10) {
  //     showToast('error', 'Please Enter 10 Digit Mobile Number');
  //   } else {


  //     const collectData = {
  //       "Auth": token,
  //       "userPhone": userphone,
  //       "deviceName": brand,
  //       "DeviceMAC": MACaddress,
  //       "DeviceType": model,
  //       "DUID": serialNum // serial number of device
  //     }
  //     const options = {
  //       method: 'POST',
  //       body: JSON.stringify(collectData)
  //     };
  //     setisRequested(!isRequested)
  //     fetch('http://192.168.43.39/True%20connect%20API/AuthUser.php', options)
  //       .then(response => response.json())
  //       .then(response => {
  //         showToast('success', response.msg)
  //         console.log(response);
  //         Keyboard.dismiss();
  //         if (response.code == 222) {
  //           setOTP(response.otp)
  //           setisRequested(false)
  //           setshowNextForm(true)
  //         } else {
  //           setisRequested(false)
  //           alert(response.msg)
  //           showToast('error', `${response.msg} ${response.code}`)
  //         }

  //       })
  //       .catch(err => console.error(err));
  //   }
  // }



  // Handle the button press

  async function signInWithPhoneNumber() {
    if (userphone.length !== 10) {
      showToast('error', 'Please Enter 10 Digit Mobile Number');
    } else {
      setisRequested(!isRequested)
      const confirmation = await auth().signInWithPhoneNumber(`+91${userphone}`);
      setConfirm(confirmation);
      if (confirmation) {
        setisRequested(false)
        setshowNextForm(true)
      }
    }

  }

  // function VerifyOTPandNext() {
  //   const collectData = {
  //     "Auth": token,
  //     "userPhone": userphone,
  //     "deviceName": brand,
  //     "DeviceMAC": MACaddress,
  //     "DeviceType": model,
  //     "DUID": serialNum // serial number of device
  //   }
  //   const options = {
  //     method: 'POST',
  //     body: JSON.stringify(collectData)
  //   };

  //   if (enterOTP.length < 4) {
  //     showToast('error', 'Please Enter OTP ?');
  //   } else {
  //     if (enterOTP == OTP) {
  //       setVerifyReq(true)
  //       Keyboard.dismiss();
  //       fetch('http://192.168.43.39/True%20connect%20API/verifyUser.php', options)
  //         .then(response => response.json())
  //         .then(response => {
  //           console.log(response)
  //           if (response.code == 222) {
  //             storeData('isLogin','Yes')
  //             storeData('userInfo',JSON.stringify(response.userData))
  //             setVerifyReq(false)
  //           } else {
  //             alert(response.msg)
  //           }
  //         })
  //         .catch(err => console.error(err));
  //     } else {
  //       showToast('error', 'Entered OTP Not Match, Enter Valid OTP');
  //     }
  //   }

  // }

  async function confirmCode() {
    try {
      if (enterOTP.length < 4) {
        showToast('error', 'Please Enter OTP ?');
      } else {
        await confirm.confirm(enterOTP);
      }
    } catch (error) {
      console.log('Invalid code.', error);
    }
  }



  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log('state', user)
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log("subscriber",subscriber)
    return subscriber; // unsubscribe on unmount

  })

  console.log('confirm', confirm)
  console.log('users', user)

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
          <TextInput placeholder='Enter Mobile No.' style={styles.inputPhone} keyboardType='numeric' maxLength={10} onChangeText={(text) => setUserPhone(text)} />

          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber} disabled={isRequested}>
            <Text style={styles.buttonText}> Get OTP {isRequested ? <ActivityIndicator color={whiteClr} /> : <AntDesign name='unlock' style={styles.buttonIcon} />}</Text>
          </TouchableOpacity >
        </View>

        {/* ****** dispaly after successfully sent otp  ::: default none after set 'flex' */}
        <View style={{ display: showNextForm ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}>
          <TextInput placeholder='Enter OTP ' style={[styles.inputPhone, { textAlign: 'center', fontWeight: '800' }]} onChangeText={(text) => setenterOTP(text)} />
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