import DeviceInfo from 'react-native-dev-info'
import Logo from '../assets/LOGO/logo.svg';
const appName = 'True Connect';
// used color in this project
var dimGreenClr = '#03C988';
var primaryClr = '#AF10FE';
var dangerClr = '#FD3B2E';
var mutedClr = '#BDBDBD';
var whiteClr = '#FFFFFF';
var pinkClr = '#FFCEFE';
var blackClr = '#000000';

//  font family 
const RobotoBold = 'Roboto-Bold';
const RobotoRegular = 'Roboto-Regular';
const RobotoMedium = 'Roboto-Medium';
const ZeyadaRegular = 'Zeyada-Regular';
const RobotoMediumItalic = 'Roboto-MediumItalic';

const PoppinsBold = 'Poppins-Bold';
const PoppinsMedium = 'Poppins-Medium';
const PoppinsExtraBold = 'Poppins-ExtraBold';
const PoppinsRegular = 'Poppins-Regular';
const PoppinsMediumItalic = 'Poppins-MediumItalic';

// Auth Token
const token = '33XX55XX';
// device data
let brand = DeviceInfo.getBrand();
var MACaddress;

DeviceInfo.getMacAddress().then((mac) => {
    MACaddress = mac
});
var serialNum;
DeviceInfo.getSerialNumber().then((serialNumber) => {
    serialNum = serialNumber
});
let model = DeviceInfo.getModel();
export {
    appName,
    dimGreenClr,
    primaryClr,
    dangerClr,
    mutedClr,
    whiteClr,
    blackClr,
    pinkClr,
    RobotoBold,
    RobotoRegular,
    RobotoMedium,
    ZeyadaRegular,
    RobotoMediumItalic,
    Logo,
    PoppinsBold,
    PoppinsMedium,
    PoppinsExtraBold,
    PoppinsRegular,
    PoppinsMediumItalic,
    token,
    brand,
    MACaddress,
    model,
    serialNum
}