import { View, Text, StyleSheet, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React from 'react'
import { blackClr, dimGreenClr, Logo, pinkClr, PoppinsBold, primaryClr, RobotoMedium, whiteClr } from '../Common'
import {
  responsiveHeight, responsiveWidth, responsiveFontSize
} from "react-native-responsive-dimensions";
import Girl from "../../assets/myimg/girl.svg";
import AntDesign from 'react-native-vector-icons/AntDesign'


const SecondScreen = () => {
  console.log(responsiveWidth(16.7))
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 100
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
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
          <TextInput placeholder='Enter Email' style={styles.inputEmail} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}> Get OTP <AntDesign name='unlock' style={styles.buttonIcon} /></Text>
          </TouchableOpacity >
        </View>

        {/* ****** dispaly after successfully sent otp  ::: default none after set 'flex' */}
        <View style={{ display: 'none', justifyContent: 'center', alignItems: 'center' }}>
          <TextInput placeholder='Enter OTP ' style={styles.inputEmail} />
          <TouchableOpacity style={[styles.button, {backgroundColor: dimGreenClr}]}>
            <Text style={styles.buttonText}> Verify OTP <AntDesign name='unlock' style={[styles.buttonIcon,{color : primaryClr}]} /></Text>
          </TouchableOpacity >
        </View>

      </View>

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
  inputEmail: {
    borderWidth: 2,
    borderColor: primaryClr,
    borderRadius: responsiveWidth(5),
    width: responsiveWidth(70),
    fontSize: responsiveFontSize(2.2),
    padding: responsiveWidth(1.4),
    backgroundColor: whiteClr
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