import { View, Text, PermissionsAndroid, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native'
import React, { useState, useEffect, useCallback, memo } from 'react'
import TopHeader from '../Component/TopHeader'
import CallLogs from 'react-native-call-log'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { appName, blackClr, dimGreenClr, mutedClr, pinkClr, PoppinsMedium, PoppinsRegular, primaryClr, RobotoBold, whiteClr } from '../Common'




const Calllogs = () => {
    const [callLogsData, setcallLogsData] = useState([]);
    const [oldDataLogs, setoldDataLogs] = useState([]);
    const [isPermission, setPermission] = useState(false)


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
    const ITEM_HEIGHT = 40; // optimize view at a time only 20 data
    const getItemLayout = useCallback((data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
    }), [])



    return (
        <View>
            <TopHeader searchFun={onSearchText} tabname='CallLogs' />
            {/* show call logs data  */}
          
            <FlatList
                data={callLogsData}
                style={{ marginBottom: responsiveHeight(8.4) }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.Viewlist}  >
                            <View style={styles.icon} >
                                {(item.type == "OUTGOING" ? ICONType('call-made', item.type) : item.type == 'MISSED' ? ICONType('call-missed', item.type) : item.type == 'UNKNOWN' ? ICONType('block', item.type) : item.type == 'INCOMING' ? ICONType('call-received', item.type) : '')}
                            </View>
                            <View style={{ width: responsiveWidth(45) }}>
                                <Text style={styles.viewListName}>{item.name}</Text>
                                <Text>{item.phoneNumber}</Text>
                            </View>
                            <View>
                                <Text style={{ width: responsiveWidth(30), textAlign: 'center' }}> {item.dateTime}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                getItemLayout={getItemLayout}
            />
            
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
    }
})

export default memo(Calllogs)