import { View, Text, PermissionsAndroid, StyleSheet, TouchableOpacity, useColorScheme, FlatList, Modal, Pressable, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useCallback, memo } from 'react'
import TopHeader from '../Component/TopHeader'
import CallLogs from 'react-native-call-log'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { appName, blackClr, dimGreenClr, mutedClr, pinkClr, PoppinsMedium, PoppinsRegular, primaryClr, RobotoBold, RobotoMedium, whiteClr } from '../Common'
import firebase from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';


const Calllogs = ({ navigation }) => {
    const [alreadyLogin, setalreadyLogin] = useState(firebase.auth().currentUser)
    const [callLogsData, setcallLogsData] = useState([]);
    const [oldDataLogs, setoldDataLogs] = useState([]);
    const [isPermission, setPermission] = useState(false)
    const [otherUserContacts, setOtherUserContacts] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme(); // detect dark mode 

    async function getCallData() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: 'Read Call Logs',
                    message: 'to provide you full information access your call logs.',
                    buttonPositive: 'OK',
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setPermission(true)
                CallLogs.load(400).then(logs => {

                    // console.log('Calll', logs);
                    setoldDataLogs(logs)
                    setcallLogsData(logs)
                })
            } else {
                alert('Call Log permission denied, Please Allow to read call Logs ?');
                setPermission(false)

            }
        } catch (error) {
            console.log('Error Load Call Logs', error)
        }
    }

    const onSearchText = (text) => {
        // filter number
        if (text == '') {
            setcallLogsData(oldDataLogs)
        } else {
            var tempLogs = callLogsData.filter((item) => {
                return item.phoneNumber.toLowerCase().indexOf(text.toLowerCase()) > -1
            })
            setcallLogsData(tempLogs)
        }
    }



    useEffect(() => {
        getCallData()
    }, [])
    // console.log('oldDataLogs', oldDataLogs)

    function ICONType(iconType, type) {
        var colortype = (type == "UNKNOWN" ? '#ff1a1a' : type == "MISSED" ? dimGreenClr : type == "INCOMING" ? '#FFB84C' : mutedClr);
        return <MaterialIcons name={iconType} size={responsiveWidth(6)} color={colortype} />
    }



    // ***** this may produce error because of long data set in flatlist 
    const ITEM_HEIGHT = 80; // optimize view at a time only 20 data
    const getItemLayout = useCallback((data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
    }), [])


    function validatePhoneNumber(phoneNumber) {
        const pattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
        if (pattern.test(phoneNumber)) {
            // Phone number is valid
            if (phoneNumber.length === 10) {
                // Phone number has 10 digits, add +91 prefix
                return "+91" + phoneNumber;
            } else {
                // Phone number already has a prefix or is not 10 digits
                return phoneNumber;
            }
        } else {
            // Phone number is invalid not length 10
            return null;
        }
    }


    function formatPhoneNumber(phoneNumber) {
        // Remove all non-numeric characters from the phone number
        phoneNumber = phoneNumber.replace(/\D/g, '');

        // If the phone number is less than 10 digits, return null
        if (phoneNumber.length < 10) {
            return null;
        }

        // If the phone number starts with "91", add a "+" sign
        if (phoneNumber.startsWith('91')) {
            phoneNumber = '+' + phoneNumber;
        }

        // If the phone number starts with "0", replace it with "+91"
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '+91' + phoneNumber.substr(1);
        }

        // If the phone number does not start with "91" or "0", assume it is a 10-digit number and add "+91" to the beginning
        if (!phoneNumber.startsWith('+91')) {
            phoneNumber = '+91' + phoneNumber;
        }

        // If the phone number is longer than 13 digits, return null
        if (phoneNumber.length > 13) {
            return null;
        }

        // If the phone number is exactly 13 digits, return it
        if (phoneNumber.length === 13) {
            return phoneNumber;
        }

        // If the phone number is 11 digits, assume it starts with "+91" and return it
        if (phoneNumber.length === 11) {
            return '+' + phoneNumber;
        }

        // If the phone number is 12 digits, assume it starts with "0" and replace it with "+91"
        if (phoneNumber.length === 12) {
            return phoneNumber.replace(/^0/, '+91');
        }

        // If the phone number is not 10, 11, 12, or 13 digits, return null
        return null;
    }


    async function getDetailsOfNumber(number) {
        const phoneNum = validatePhoneNumber(number);
        if (phoneNum !== null) {
            const usersDoc = await firestore().collection('Users');
            const usersDocGet = await usersDoc.doc(phoneNum).get();

            if (usersDocGet.exists) {
                var thisUID = usersDocGet._data.uid;
                console.log('Doc Exists', thisUID)
                const ContactsData = await firestore().collection('Contacts');
                const ContactsDataGet = await ContactsData.doc(thisUID).get();

                if (ContactsDataGet.exists) {
                    const data = await ContactsDataGet.data().data;
                    console.log('Found')
                    // console.log(data)
                    setModalVisible(true)
                    data.map((mapdata, index) => {

                        mapdata.phoneNumbers && mapdata.phoneNumbers.length > 0 && mapdata.phoneNumbers.map((thisPhoneData, index) => {

                            if (formatPhoneNumber(thisPhoneData.phoneNumber) == formatPhoneNumber(phoneNum)) {
                                // alert(`Name: ${mapdata.name} , Phone : ${phoneNum}`)
                                setOtherUserContacts({
                                    "hisName": mapdata.name,
                                    "hisPhone": phoneNum
                                })
                            }
                            // console.log('Ph',  formatPhoneNumber(phoneNum))
                        })
                    })

                } else {
                    Alert.alert('Oh Sorry', 'They have not sync his contacts Yet ?')
                }

            } else {
                console.log('Doc not Exists')
                Alert.alert('Sorry', 'Which Phone Number You want to search, that user is not using our App , Say him/her to use this app than i will give you all info')
            }
        }

    }

    return (
        <View>
            <TopHeader searchFun={onSearchText} tabname='CallLogs' />
            {/* show call logs data  */}
            {callLogsData !== [] ? (<FlatList
                data={callLogsData}
                style={{ marginBottom: responsiveHeight(8.4) }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.Viewlist} onPress={() => getDetailsOfNumber(item.phoneNumber)} >
                            <View style={styles.icon} >
                                {(item.type == "OUTGOING" ? ICONType('call-made', item.type) : item.type == 'MISSED' ? ICONType('call-missed', item.type) : item.type == 'UNKNOWN' ? ICONType('block', item.type) : item.type == 'INCOMING' ? ICONType('call-received', item.type) : '')}
                            </View>
                            <View style={{ width: responsiveWidth(45) }}>
                                <Text style={styles.viewListName}>{item.name}</Text>
                                <Text style={{ color: colorScheme == 'dark' ? '#3F497F' : '#3F497F' }}>{item.phoneNumber}</Text>
                            </View>
                            <View>
                                <Text style={{ width: responsiveWidth(30), textAlign: 'center' }}> {item.dateTime}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                getItemLayout={getItemLayout}
            />) :
                <ActivityIndicator size={responsiveFontSize(5)} color={dimGreenClr} />
            }

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ marginBottom: 5 }}>
                                {otherUserContacts !== null ? (<>
                                    <Text style={[styles.modalText, { fontFamily: RobotoMedium, fontSize: responsiveFontSize(2.3), color: blackClr }]}>He/She has saved your number with name:
                                        <Text style={{ color: dimGreenClr, fontFamily: PoppinsMedium, }}> {otherUserContacts.hisName} </Text></Text>

                                    <Text style={[styles.modalText, { fontFamily: RobotoMedium, fontSize: responsiveFontSize(2.3), color: blackClr }]}>Number:
                                        <Text style={{ color: dimGreenClr, fontFamily: PoppinsMedium, }}>{otherUserContacts.hisPhone}</Text></Text>
                                </>) : <ActivityIndicator size={responsiveFontSize(5)} />}

                            </View>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Hide</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Viewlist: {
        display: 'flex',
        justifyContent: 'space-around',
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
        padding: responsiveWidth(2),
        marginTop: 5,
        borderRadius: responsiveWidth(1),
        backgroundColor: whiteClr,
        borderBottomWidth: 1,
        borderBottomColor: mutedClr
    },
    icon: {
        width: responsiveWidth(7),
        // backgroundColor: dimGreenClr,
    },
    viewListName: {
        color: blackClr,
        fontFamily: PoppinsRegular,
        fontSize: responsiveFontSize(2.1),
        textAlign: 'left'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: pinkClr
    },
    modalView: {
        margin: 2,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: responsiveWidth(90),
        height: responsiveHeight(40),
        display: 'flex',
        justifyContent: 'space-between'
    },
    appname: {
        fontFamily: RobotoBold,
        fontSize: responsiveFontSize(3.4),
        color: dimGreenClr
    },
    databox: {
        // backgroundColor:dimGreenClr,
        width: responsiveWidth(90),
        height: responsiveHeight(30),
        padding: 3
    },
    dataText: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: PoppinsMedium,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderBottomColor: dimGreenClr,
        color: blackClr,
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: responsiveWidth(70)
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})

export default memo(Calllogs)