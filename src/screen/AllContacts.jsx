import { View, Text, PermissionsAndroid, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState, useCallback, memo } from 'react'
import Contacts from 'react-native-contacts';
import TopHeader from '../Component/TopHeader';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { appName, blackClr, dimGreenClr, mutedClr, pinkClr, PoppinsMedium, PoppinsRegular, primaryClr, RobotoBold, token, whiteClr } from '../Common'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import firebase from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';


const AllContacts = () => {
  const [alreadyLogin, setalreadyLogin] = useState(firebase.auth().currentUser)
  const [contactsData, setContactsData] = useState([]);
  const [oldcontactsData, setoldContactsData] = useState([]);
  const [oldDataatServer, setoldDataatServer] = useState([]);
  // const [databaseContacts, setdatabaseContacts] = useState([]);



  async function getAllContactsData() {
    try {
      const grant = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Ok',
      })
      if (grant === PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll().then(contacts => {

          const contactsWithNamesAndPhones = contacts.reduce((acc, contact) => {
            const uniquePhoneNumbers = new Set(
              contact.phoneNumbers.map((phoneNumber) =>
                phoneNumber.number.replace(/\D/g, '') // for remove symbole and space
              )
            );
            const contactsWithPhoneNumbers = Array.from(uniquePhoneNumbers).map(
              (phoneNumber) => ({ name: contact.displayName, phoneNumber })
            );
            const existingContactIndex = acc.findIndex(
              (c) => c.name === contact.displayName
            );
            if (existingContactIndex !== -1) {
              acc[existingContactIndex].phoneNumbers.push(...contactsWithPhoneNumbers); // if same name find multipal time than that will merge his phone number in array
            } else {
              acc.push({ name: contact.displayName, phoneNumbers: contactsWithPhoneNumbers });
            }
            return acc;
          }, []);

          // const phoneNumbers = contactsWithNamesAndPhones.map((contact) => contact.phoneNumber);
          // const uniquePhoneNumbers = [...new Set(phoneNumbers)];

          // console.table(contactsWithNamesAndPhones)

          // setContactsData(contacts)
          // setoldContactsData(contacts)
          // console.log(JSON.stringify(contactsWithNamesAndPhones))

          /*   AsyncStorage.getItem('userInfo').then((res) => {
              if (res !== null) {
                const jsondata = JSON.parse(res)
                const bodydata = {
                  "Auth": token,
                  "userID": jsondata.uid,
                  "userPhone": jsondata.phone,
                  "contactsData": contactsWithNamesAndPhones
                }
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(bodydata)
                };
  
                fetch('http://192.168.43.39/True%20connect%20API/Contacts/insert.php', options)
                  .then(response => response.json())
                  .then(response => console.log(response))
                  .catch(err => console.error(err));
              }
            }) */

          SendToFireStore(alreadyLogin.uid, contactsWithNamesAndPhones)
          // console.log('alreadyLogin', alreadyLogin.uid)

          setContactsData(contactsWithNamesAndPhones)
          setoldContactsData(contactsWithNamesAndPhones)
        })


      } else {
        console.log('Permission Denied to View Contacts Number, Please Allow to see Contacts number otherwise app will not work ?')
        alert('Permission Denied to View Contacts Number, Please Allow to see Contacts number otherwise app will not work ?')
      }
    } catch (error) {
      console.log('Permisson Error Contacts ', error)
    }
  }

  async function SendToFireStore(userID, data) {
    // send to firebase
    try {
      let Res;
      const docRef = await firestore().collection('Contacts');

      // Get the document snapshot using the get() method
      const docSnapshot = await docRef.doc(userID).get();
      // Check if the document exists
      if (docSnapshot.exists) {
        console.log('Document exists');
        // const readRef =await  docRef.doc(userID).get();
        // setoldDataatServer(readRef.data().data)

        Res = await docRef.doc(userID).set({
          data,
          userID: alreadyLogin.phoneNumber,
        });
      } else {
        console.log('Document does not exist');
        Res = await docRef.doc(userID).set({
          data,
          userID: alreadyLogin.phoneNumber,
        });
      }

      console.log('Res', Res)
      if (Res == null) {
        console.log('Result done , updated', Res)
        Alert.alert('Connection', 'Sync done')
      } else {
        console.log('Do not know, what happen ')
        Alert.alert('Connection', 'Sync done with ...')
      }
    } catch (error) {
      console.log('SendToFire', error)
    }
  }
  const onSearchText = (text) => {
    // filter number
    if (text == '') {
      setContactsData(oldcontactsData)
    } else {
      var tempLogs = contactsData.filter((item) => {
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      })
      setContactsData(tempLogs)
    }
  }

  const ITEM_HEIGHT = 40; // optimize view at a time only 20 data
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  }), [])

  // console.log(oldDataatServer)

  useEffect(() => {
    getAllContactsData()
  }, [])

  return (
    <View>
      <TopHeader searchFun={onSearchText} tabname='Contacts' />
      {contactsData !== [] ? (
        <FlatList
          data={contactsData}
          style={{ marginBottom: responsiveHeight(8.4) }}
          keyExtractor={(item, index) => {
            return index.toString()
          }}
          getItemLayout={getItemLayout}
          initialNumToRender={20}
          renderItem={({ item }) => {
            return (
              <View style={styles.Viewlist} >
                <View style={styles.icon} >
                  <FontAwesome5 name={'user-circle'} size={responsiveWidth(8)} />
                </View>
                <View style={{ width: responsiveWidth(70), marginLeft: responsiveWidth(5) }}>
                  <Text style={styles.viewListName}>{item.name}</Text>
                  {item.phoneNumbers && item.phoneNumbers.length > 0 && item.phoneNumbers.map((numberData, numberIndex) => {
                    // console.log('numData', numberData)
                    return (
                      <TouchableOpacity key={numberIndex}>
                        <Text>{numberData.phoneNumber}</Text>
                      </TouchableOpacity>
                    )
                  })}

                </View>

              </View>
            )
          }}

        />
      ) : <ActivityIndicator size={responsiveFontSize(5)} color={dimGreenClr} />
      }

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
export default memo(AllContacts)