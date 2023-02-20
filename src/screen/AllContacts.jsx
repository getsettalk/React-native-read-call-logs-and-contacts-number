import { View, Text, PermissionsAndroid, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Contacts from 'react-native-contacts';
import TopHeader from '../Component/TopHeader';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { appName, blackClr, dimGreenClr, mutedClr, pinkClr, PoppinsMedium, PoppinsRegular, primaryClr, RobotoBold, whiteClr } from '../Common'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


const AllContacts = () => {
  const [contactsData, setContactsData] = useState([]);
  const [oldcontactsData, setoldContactsData] = useState([]);
  const [databaseContacts, setdatabaseContacts] = useState([]);

  async function getAllContactsData() {
    try {
      const grant = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Ok',
      })
      if (grant === PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll().then(contacts=>{
                  // console.log('contacts', contacts)
        setContactsData(contacts)
        setoldContactsData(contacts)
        })


      } else {
        console.log('Permission Denied to View Contacts Number, Please Allow to see Contacts number otherwise app will not work ?')
        alert('Permission Denied to View Contacts Number, Please Allow to see Contacts number otherwise app will not work ?')
      }
    } catch (error) {
      console.log('Permisson Error Contacts ', error)
    }
  }

  const onSearchText = (text) => {
    // filter number
    if (text == '') {
      setContactsData(oldcontactsData)
    } else {
      var tempLogs = contactsData.filter((item) => {
        return item.displayName.toLowerCase().indexOf(text.toLowerCase()) > -1
      })
      setContactsData(tempLogs)
    }
  }


  useEffect(() => {
    getAllContactsData()
  }, [])
  return (
    <View>
      <TopHeader searchFun={onSearchText} tabname='Contacts' />
      <FlatList
        data={contactsData}
        style={{ marginBottom: responsiveHeight(8.4) }}
        keyExtractor={(item, index) => item.recordID + Math.floor(Math.random() *100)}
        renderItem={({ item }) => {
          // console.log(item.phoneNumbers)
          return (
            <View style={styles.Viewlist} >
              <View style={styles.icon} >
                <FontAwesome5 name={'user-circle'} size={responsiveWidth(8)} />
              </View>
              <View style={{ width: responsiveWidth(70), marginLeft: responsiveWidth(5) }}>
                <Text style={styles.viewListName}>{item.displayName}</Text>
                {item.phoneNumbers && item.phoneNumbers.length > 0 && item.phoneNumbers.map((numberData, numberIndex) => {
                  // console.log('numData', numberData)
                  return (
                    <TouchableOpacity >
                      <Text>{numberData.number}</Text>
                    </TouchableOpacity>
                  ) 
                })}

              </View>

            </View>
          )
        }}

      />
    </View>
  )
}

const styles = StyleSheet.create({
  Viewlist: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    marginHorizontal: responsiveWidth(3),
    padding: responsiveWidth(1),
    marginTop: 5,
    borderRadius: responsiveWidth(1),
    backgroundColor: whiteClr,
    borderBottomWidth: 1,
    borderBottomColor: mutedClr,
    width: responsiveWidth(95)
  },
  icon: {
    width: responsiveWidth(10),
    // backgroundColor: dimGreenClr,
    textAlign: 'left',
    marginLeft: 1
  },
  viewListName: {
    color: blackClr,
    fontFamily: PoppinsRegular,
    fontSize: responsiveFontSize(2.1),
    textAlign: 'left'
  },
});
export default AllContacts