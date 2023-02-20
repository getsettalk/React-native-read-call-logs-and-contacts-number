import { ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { dimGreenClr, pinkClr, dangerClr, whiteClr, blackClr, RobotoBold, RobotoMedium, RobotoRegular, primaryClr } from '../Common'

import IntroIcon from '../../assets/myimg/intro1.svg';
// import FontAws from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'

const FirstView = ({ navigation }) => {

  return (
    <ScrollView style={{ flex: 1, backgroundColor: whiteClr, paddingHorizontal: responsiveWidth(5) }} showsVerticalScrollIndicator={false}>
      <StatusBar translucent={false} backgroundColor={whiteClr} barStyle={'dark-content'} />
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: responsiveHeight(59) }} >
        <IntroIcon width={responsiveHeight(43)} height={responsiveHeight(43)} style={{ marginLeft: responsiveWidth(5) }} />
        {/* greeting message  */}
        <Text style={{ fontSize: responsiveFontSize(3.89), color: blackClr, fontFamily: RobotoBold }}>WELCOME</Text>
        <Text style={{ fontFamily: RobotoRegular, color: blackClr, fontSize: responsiveFontSize(2.5), textAlign: 'center', textTransform: 'capitalize' }}>Know full information about your <Text style={{ color: dimGreenClr, fontFamily: RobotoMedium, fontSize: responsiveFontSize(2.59), textTransform: 'capitalize' }}>contacts</Text>.</Text>
      </View>

      <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: responsiveHeight(37) }}>
        {/* navigate to second screen  */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Final')}>
          <Text style={styles.buttonText}>Get Start </Text>
          <AntDesign name='rightcircleo' style={styles.buttonIcon} />
        </TouchableOpacity>

        <Text style={{ fontSize: responsiveFontSize(1.2), marginTop: responsiveWidth(2) }}> Safe & Secure</Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: primaryClr,
    width: responsiveWidth(50),
    height: responsiveHeight(7),
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
    backgroundColor: dimGreenClr,
    color: whiteClr,
    fontSize: responsiveWidth(6),
    borderRadius: responsiveWidth(6 / 2)
  }


})
export default FirstView