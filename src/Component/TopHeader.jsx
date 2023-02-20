import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { blackClr, Logo, mutedClr, pinkClr, primaryClr, whiteClr } from '../Common';


const TopHeader = (props) => {
  // console.log(props)
  return (
    <View style={styles.HeaderBox}>
      <Logo width={responsiveWidth(15)} height={responsiveWidth(15)} />
      <TextInput style={styles.SearchBar} placeholder={props.tabname == 'Contacts'? 'Search by name' : 'Seach by number' } onChangeText={(text)=>props.searchFun(text)} />
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
  }
})
export default TopHeader