import { storeToken } from "@/utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import BottomCard from "../../components/common/universal_card";

const { height, width } = Dimensions.get("window");

type FormFields = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'phone';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const countries: CountryData[] = [
  // North America
  { name: "Anguilla", code: "AI", dialCode: "1", flag: "🇦🇮" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "1", flag: "🇦🇬" },
  { name: "Aruba", code: "AW", dialCode: "297", flag: "🇦🇼" },
  { name: "Bahamas", code: "BS", dialCode: "1", flag: "🇧🇸" },
  { name: "Barbados", code: "BB", dialCode: "1", flag: "🇧🇧" },
  { name: "Belize", code: "BZ", dialCode: "501", flag: "🇧🇿" },
  { name: "Bermuda", code: "BM", dialCode: "1", flag: "🇧🇲" },
  { name: "British Virgin Islands", code: "VG", dialCode: "1", flag: "🇻🇬" },
  { name: "Canada", code: "CA", dialCode: "1", flag: "🇨🇦" },
  { name: "Cayman Islands", code: "KY", dialCode: "1", flag: "🇰🇾" },
  { name: "Costa Rica", code: "CR", dialCode: "506", flag: "🇨🇷" },
  { name: "Cuba", code: "CU", dialCode: "53", flag: "🇨🇺" },
  { name: "Curaçao", code: "CW", dialCode: "599", flag: "🇨🇼" },
  { name: "Dominica", code: "DM", dialCode: "1", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", dialCode: "1", flag: "🇩🇴" },
  { name: "El Salvador", code: "SV", dialCode: "503", flag: "🇸🇻" },
  { name: "Grenada", code: "GD", dialCode: "1", flag: "🇬🇩" },
  { name: "Guatemala", code: "GT", dialCode: "502", flag: "🇬🇹" },
  { name: "Haiti", code: "HT", dialCode: "509", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", dialCode: "504", flag: "🇭🇳" },
  { name: "Jamaica", code: "JM", dialCode: "1", flag: "🇯🇲" },
  { name: "Mexico", code: "MX", dialCode: "52", flag: "🇲🇽" },
  { name: "Montserrat", code: "MS", dialCode: "1", flag: "🇲🇸" },
  { name: "Nicaragua", code: "NI", dialCode: "505", flag: "🇳🇮" },
  { name: "Panama", code: "PA", dialCode: "507", flag: "🇵🇦" },
  { name: "Puerto Rico", code: "PR", dialCode: "1", flag: "🇵🇷" },
  { name: "Saint Kitts and Nevis", code: "KN", dialCode: "1", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", dialCode: "1", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "VC", dialCode: "1", flag: "🇻🇨" },
  { name: "Sint Maarten", code: "SX", dialCode: "1", flag: "🇸🇽" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "1", flag: "🇹🇹" },
  { name: "Turks and Caicos Islands", code: "TC", dialCode: "1", flag: "🇹🇨" },
  { name: "United States", code: "US", dialCode: "1", flag: "🇺🇸" },
  { name: "US Virgin Islands", code: "VI", dialCode: "1", flag: "🇻🇮" },

  // South America
  { name: "Argentina", code: "AR", dialCode: "54", flag: "🇦🇷" },
  { name: "Bolivia", code: "BO", dialCode: "591", flag: "🇧🇴" },
  { name: "Brazil", code: "BR", dialCode: "55", flag: "🇧🇷" },
  { name: "Chile", code: "CL", dialCode: "56", flag: "🇨🇱" },
  { name: "Colombia", code: "CO", dialCode: "57", flag: "🇨🇴" },
  { name: "Ecuador", code: "EC", dialCode: "593", flag: "🇪🇨" },
  { name: "Falkland Islands", code: "FK", dialCode: "500", flag: "🇫🇰" },
  { name: "French Guiana", code: "GF", dialCode: "594", flag: "🇬🇫" },
  { name: "Guyana", code: "GY", dialCode: "592", flag: "🇬🇾" },
  { name: "Paraguay", code: "PY", dialCode: "595", flag: "🇵🇾" },
  { name: "Peru", code: "PE", dialCode: "51", flag: "🇵🇪" },
  { name: "Suriname", code: "SR", dialCode: "597", flag: "🇸🇷" },
  { name: "Uruguay", code: "UY", dialCode: "598", flag: "🇺🇾" },
  { name: "Venezuela", code: "VE", dialCode: "58", flag: "🇻🇪" },

  // Europe
  { name: "Albania", code: "AL", dialCode: "355", flag: "🇦🇱" },
  { name: "Andorra", code: "AD", dialCode: "376", flag: "🇦🇩" },
  { name: "Armenia", code: "AM", dialCode: "374", flag: "🇦🇲" },
  { name: "Austria", code: "AT", dialCode: "43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", dialCode: "994", flag: "🇦🇿" },
  { name: "Belarus", code: "BY", dialCode: "375", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", dialCode: "32", flag: "🇧🇪" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "387", flag: "🇧🇦" },
  { name: "Bulgaria", code: "BG", dialCode: "359", flag: "🇧🇬" },
  { name: "Croatia", code: "HR", dialCode: "385", flag: "🇭🇷" },
  { name: "Cyprus", code: "CY", dialCode: "357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", dialCode: "420", flag: "🇨🇿" },
  { name: "Denmark", code: "DK", dialCode: "45", flag: "🇩🇰" },
  { name: "Estonia", code: "EE", dialCode: "372", flag: "🇪🇪" },
  { name: "Faroe Islands", code: "FO", dialCode: "298", flag: "🇫🇴" },
  { name: "Finland", code: "FI", dialCode: "358", flag: "🇫🇮" },
  { name: "France", code: "FR", dialCode: "33", flag: "🇫🇷" },
  { name: "Georgia", code: "GE", dialCode: "995", flag: "🇬🇪" },
  { name: "Germany", code: "DE", dialCode: "49", flag: "🇩🇪" },
  { name: "Gibraltar", code: "GI", dialCode: "350", flag: "🇬🇮" },
  { name: "Greece", code: "GR", dialCode: "30", flag: "🇬🇷" },
  { name: "Greenland", code: "GL", dialCode: "299", flag: "🇬🇱" },
  { name: "Guernsey", code: "GG", dialCode: "44", flag: "🇬🇬" },
  { name: "Hungary", code: "HU", dialCode: "36", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", dialCode: "354", flag: "🇮🇸" },
  { name: "Ireland", code: "IE", dialCode: "353", flag: "🇮🇪" },
  { name: "Isle of Man", code: "IM", dialCode: "44", flag: "🇮🇲" },
  { name: "Italy", code: "IT", dialCode: "39", flag: "🇮🇹" },
  { name: "Jersey", code: "JE", dialCode: "44", flag: "🇯🇪" },
  { name: "Kosovo", code: "XK", dialCode: "383", flag: "🇽🇰" },
  { name: "Latvia", code: "LV", dialCode: "371", flag: "🇱🇻" },
  { name: "Liechtenstein", code: "LI", dialCode: "423", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", dialCode: "370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", dialCode: "352", flag: "🇱🇺" },
  { name: "Malta", code: "MT", dialCode: "356", flag: "🇲🇹" },
  { name: "Moldova", code: "MD", dialCode: "373", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", dialCode: "377", flag: "🇲🇨" },
  { name: "Montenegro", code: "ME", dialCode: "382", flag: "🇲🇪" },
  { name: "Netherlands", code: "NL", dialCode: "31", flag: "🇳🇱" },
  { name: "North Macedonia", code: "MK", dialCode: "389", flag: "🇲🇰" },
  { name: "Norway", code: "NO", dialCode: "47", flag: "🇳🇴" },
  { name: "Poland", code: "PL", dialCode: "48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dialCode: "351", flag: "🇵🇹" },
  { name: "Romania", code: "RO", dialCode: "40", flag: "🇷🇴" },
  { name: "Russia", code: "RU", dialCode: "7", flag: "🇷🇺" },
  { name: "San Marino", code: "SM", dialCode: "378", flag: "🇸🇲" },
  { name: "Serbia", code: "RS", dialCode: "381", flag: "🇷🇸" },
  { name: "Slovakia", code: "SK", dialCode: "421", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", dialCode: "386", flag: "🇸🇮" },
  { name: "Spain", code: "ES", dialCode: "34", flag: "🇪🇸" },
  { name: "Svalbard and Jan Mayen", code: "SJ", dialCode: "47", flag: "🇸🇯" },
  { name: "Sweden", code: "SE", dialCode: "46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dialCode: "41", flag: "🇨🇭" },
  { name: "Ukraine", code: "UA", dialCode: "380", flag: "🇺🇦" },
  { name: "United Kingdom", code: "GB", dialCode: "44", flag: "🇬🇧" },
  { name: "Vatican City", code: "VA", dialCode: "379", flag: "🇻🇦" },

  // Africa
  { name: "Algeria", code: "DZ", dialCode: "213", flag: "🇩🇿" },
  { name: "Angola", code: "AO", dialCode: "244", flag: "🇦🇴" },
  { name: "Benin", code: "BJ", dialCode: "229", flag: "🇧🇯" },
  { name: "Botswana", code: "BW", dialCode: "267", flag: "🇧🇼" },
  { name: "Burkina Faso", code: "BF", dialCode: "226", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", dialCode: "257", flag: "🇧🇮" },
  { name: "Cameroon", code: "CM", dialCode: "237", flag: "🇨🇲" },
  { name: "Cape Verde", code: "CV", dialCode: "238", flag: "🇨🇻" },
  { name: "Central African Republic", code: "CF", dialCode: "236", flag: "🇨🇫" },
  { name: "Chad", code: "TD", dialCode: "235", flag: "🇹🇩" },
  { name: "Comoros", code: "KM", dialCode: "269", flag: "🇰🇲" },
  { name: "Congo", code: "CG", dialCode: "242", flag: "🇨🇬" },
  { name: "DR Congo", code: "CD", dialCode: "243", flag: "🇨🇩" },
  { name: "Djibouti", code: "DJ", dialCode: "253", flag: "🇩🇯" },
  { name: "Egypt", code: "EG", dialCode: "20", flag: "🇪🇬" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "240", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", dialCode: "291", flag: "🇪🇷" },
  { name: "Ethiopia", code: "ET", dialCode: "251", flag: "🇪🇹" },
  { name: "Gabon", code: "GA", dialCode: "241", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", dialCode: "220", flag: "🇬🇲" },
  { name: "Ghana", code: "GH", dialCode: "233", flag: "🇬🇭" },
  { name: "Guinea", code: "GN", dialCode: "224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "245", flag: "🇬🇼" },
  { name: "Ivory Coast", code: "CI", dialCode: "225", flag: "🇨🇮" },
  { name: "Kenya", code: "KE", dialCode: "254", flag: "🇰🇪" },
  { name: "Lesotho", code: "LS", dialCode: "266", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", dialCode: "231", flag: "🇱🇷" },
  { name: "Libya", code: "LY", dialCode: "218", flag: "🇱🇾" },
  { name: "Madagascar", code: "MG", dialCode: "261", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", dialCode: "265", flag: "🇲🇼" },
  { name: "Mali", code: "ML", dialCode: "223", flag: "🇲🇱" },
  { name: "Mauritania", code: "MR", dialCode: "222", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", dialCode: "230", flag: "🇲🇺" },
  { name: "Mayotte", code: "YT", dialCode: "262", flag: "🇾🇹" },
  { name: "Morocco", code: "MA", dialCode: "212", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", dialCode: "258", flag: "🇲🇿" },
  { name: "Namibia", code: "NA", dialCode: "264", flag: "🇳🇦" },
  { name: "Niger", code: "NE", dialCode: "227", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", dialCode: "234", flag: "🇳🇬" },
  { name: "Réunion", code: "RE", dialCode: "262", flag: "🇷🇪" },
  { name: "Rwanda", code: "RW", dialCode: "250", flag: "🇷🇼" },
  { name: "Saint Helena", code: "SH", dialCode: "290", flag: "🇸🇭" },
  { name: "São Tomé and Príncipe", code: "ST", dialCode: "239", flag: "🇸🇹" },
  { name: "Senegal", code: "SN", dialCode: "221", flag: "🇸🇳" },
  { name: "Seychelles", code: "SC", dialCode: "248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", dialCode: "232", flag: "🇸🇱" },
  { name: "Somalia", code: "SO", dialCode: "252", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", dialCode: "27", flag: "🇿🇦" },
  { name: "South Sudan", code: "SS", dialCode: "211", flag: "🇸🇸" },
  { name: "Sudan", code: "SD", dialCode: "249", flag: "🇸🇩" },
  { name: "Swaziland", code: "SZ", dialCode: "268", flag: "🇸🇿" },
  { name: "Tanzania", code: "TZ", dialCode: "255", flag: "🇹🇿" },
  { name: "Togo", code: "TG", dialCode: "228", flag: "🇹🇬" },
  { name: "Tunisia", code: "TN", dialCode: "216", flag: "🇹🇳" },
  { name: "Uganda", code: "UG", dialCode: "256", flag: "🇺🇬" },
  { name: "Western Sahara", code: "EH", dialCode: "212", flag: "🇪🇭" },
  { name: "Zambia", code: "ZM", dialCode: "260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", dialCode: "263", flag: "🇿🇼" },

  // Asia
  { name: "Afghanistan", code: "AF", dialCode: "93", flag: "🇦🇫" },
  { name: "Armenia", code: "AM", dialCode: "374", flag: "🇦🇲" },
  { name: "Azerbaijan", code: "AZ", dialCode: "994", flag: "🇦🇿" },
  { name: "Bahrain", code: "BH", dialCode: "973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", dialCode: "880", flag: "🇧🇩" },
  { name: "Bhutan", code: "BT", dialCode: "975", flag: "🇧🇹" },
  { name: "Brunei", code: "BN", dialCode: "673", flag: "🇧🇳" },
  { name: "Cambodia", code: "KH", dialCode: "855", flag: "🇰🇭" },
  { name: "China", code: "CN", dialCode: "86", flag: "🇨🇳" },
  { name: "Cyprus", code: "CY", dialCode: "357", flag: "🇨🇾" },
  { name: "East Timor", code: "TL", dialCode: "670", flag: "🇹🇱" },
  { name: "Georgia", code: "GE", dialCode: "995", flag: "🇬🇪" },
  { name: "Hong Kong", code: "HK", dialCode: "852", flag: "🇭🇰" },
  { name: "India", code: "IN", dialCode: "91", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", dialCode: "62", flag: "🇮🇩" },
  { name: "Iran", code: "IR", dialCode: "98", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", dialCode: "964", flag: "🇮🇶" },
  { name: "Israel", code: "IL", dialCode: "972", flag: "🇮🇱" },
  { name: "Japan", code: "JP", dialCode: "81", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", dialCode: "962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", dialCode: "7", flag: "🇰🇿" },
  { name: "Kuwait", code: "KW", dialCode: "965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "996", flag: "🇰🇬" },
  { name: "Laos", code: "LA", dialCode: "856", flag: "🇱🇦" },
  { name: "Lebanon", code: "LB", dialCode: "961", flag: "🇱🇧" },
  { name: "Macau", code: "MO", dialCode: "853", flag: "🇲🇴" },
  { name: "Malaysia", code: "MY", dialCode: "60", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", dialCode: "960", flag: "🇲🇻" },
  { name: "Mongolia", code: "MN", dialCode: "976", flag: "🇲🇳" },
  { name: "Myanmar", code: "MM", dialCode: "95", flag: "🇲🇲" },
  { name: "Nepal", code: "NP", dialCode: "977", flag: "🇳🇵" },
  { name: "North Korea", code: "KP", dialCode: "850", flag: "🇰🇵" },
  { name: "Oman", code: "OM", dialCode: "968", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", dialCode: "92", flag: "🇵🇰" },
  { name: "Palestine", code: "PS", dialCode: "970", flag: "🇵🇸" },
  { name: "Philippines", code: "PH", dialCode: "63", flag: "🇵🇭" },
  { name: "Qatar", code: "QA", dialCode: "974", flag: "🇶🇦" },
  { name: "Saudi Arabia", code: "SA", dialCode: "966", flag: "🇸🇦" },
  { name: "Singapore", code: "SG", dialCode: "65", flag: "🇸🇬" },
  { name: "South Korea", code: "KR", dialCode: "82", flag: "🇰🇷" },
  { name: "Sri Lanka", code: "LK", dialCode: "94", flag: "🇱🇰" },
  { name: "Syria", code: "SY", dialCode: "963", flag: "🇸🇾" },
  { name: "Taiwan", code: "TW", dialCode: "886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", dialCode: "992", flag: "🇹🇯" },
  { name: "Thailand", code: "TH", dialCode: "66", flag: "🇹🇭" },
  { name: "Turkey", code: "TR", dialCode: "90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", dialCode: "993", flag: "🇹🇲" },
  { name: "United Arab Emirates", code: "AE", dialCode: "971", flag: "🇦🇪" },
  { name: "Uzbekistan", code: "UZ", dialCode: "998", flag: "🇺🇿" },
  { name: "Vietnam", code: "VN", dialCode: "84", flag: "🇻🇳" },
  { name: "Yemen", code: "YE", dialCode: "967", flag: "🇾🇪" },

  // Oceania
  { name: "American Samoa", code: "AS", dialCode: "1", flag: "🇦🇸" },
  { name: "Australia", code: "AU", dialCode: "61", flag: "🇦🇺" },
  { name: "Christmas Island", code: "CX", dialCode: "61", flag: "🇨🇽" },
  { name: "Cocos Islands", code: "CC", dialCode: "61", flag: "🇨🇨" },
  { name: "Cook Islands", code: "CK", dialCode: "682", flag: "🇨🇰" },
  { name: "Fiji", code: "FJ", dialCode: "679", flag: "🇫🇯" },
  { name: "French Polynesia", code: "PF", dialCode: "689", flag: "🇵🇫" },
  { name: "Guam", code: "GU", dialCode: "1", flag: "🇬🇺" },
  { name: "Kiribati", code: "KI", dialCode: "686", flag: "🇰🇮" },
  { name: "Marshall Islands", code: "MH", dialCode: "692", flag: "🇲🇭" },
  { name: "Micronesia", code: "FM", dialCode: "691", flag: "🇫🇲" },
  { name: "Nauru", code: "NR", dialCode: "674", flag: "🇳🇷" },
  { name: "New Caledonia", code: "NC", dialCode: "687", flag: "🇳🇨" },
  { name: "New Zealand", code: "NZ", dialCode: "64", flag: "🇳🇿" },
  { name: "Niue", code: "NU", dialCode: "683", flag: "🇳🇺" },
  { name: "Norfolk Island", code: "NF", dialCode: "672", flag: "🇳🇫" },
  { name: "Northern Mariana Islands", code: "MP", dialCode: "1", flag: "🇲🇵" },
  { name: "Palau", code: "PW", dialCode: "680", flag: "🇵🇼" },
  { name: "Papua New Guinea", code: "PG", dialCode: "675", flag: "🇵🇬" },
  { name: "Pitcairn Islands", code: "PN", dialCode: "64", flag: "🇵🇳" },
  { name: "Samoa", code: "WS", dialCode: "685", flag: "🇼🇸" },
  { name: "Solomon Islands", code: "SB", dialCode: "677", flag: "🇸🇧" },
  { name: "Tokelau", code: "TK", dialCode: "690", flag: "🇹🇰" },
  { name: "Tonga", code: "TO", dialCode: "676", flag: "🇹🇴" },
  { name: "Tuvalu", code: "TV", dialCode: "688", flag: "🇹🇻" },
  { name: "Vanuatu", code: "VU", dialCode: "678", flag: "🇻🇺" },
  { name: "Wallis and Futuna", code: "WF", dialCode: "681", flag: "🇼🇫" }
];

export default function GetStartedScreen() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation state
  const [touchedFields, setTouchedFields] = useState<Record<FormFields, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const keyboardHeight = useSharedValue(0);

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Too Weak",
    color: "#ff3b30"
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // State for conditional rendering
  const [showAsterisks, setShowAsterisks] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<CountryData[]>(countries);
  const countryPickerRef = useRef<View>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        keyboardHeight.value = withTiming(e.endCoordinates.height, {
          duration: 300,
        });
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        keyboardHeight.value = withTiming(0, { duration: 300 });
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchQuery]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
    flex: 1,
  }));

  // Calculate password strength
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: "Too Weak", color: "#ff3b30" };
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Complexity check
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      score += 1;
    }

    // Determine strength level
    if (score <= 2) {
      return { score, label: "Too Weak", color: "#ff3b30" };
    } else if (score <= 4) {
      return { score, label: "Weak", color: "#ff9500" };
    } else if (score <= 6) {
      return { score, label: "Medium", color: "#ffcc00" };
    } else if (score <= 8) {
      return { score, label: "Strong", color: "#34c759" };
    } else {
      return { score, label: "Very Strong", color: "#30b0c7" };
    }
  };

  // Enhanced field validation
  const validateField = (field: FormFields, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        if (value.length > 50) return "First name must be less than 50 characters";
        if (!/^[a-zA-Z\s-']+$/.test(value)) return "First name can only contain letters, spaces, hyphens, and apostrophes";
        break;

      case 'lastName':
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        if (value.length > 50) return "Last name must be less than 50 characters";
        if (!/^[a-zA-Z\s-']+$/.test(value)) return "Last name can only contain letters, spaces, hyphens, and apostrophes";
        break;

      case 'email':
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;

      case 'password':
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
        break;

      case 'confirmPassword':
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        break;

      case 'phone':
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return "Please enter a valid 10-digit phone number";
        break;
    }
    return undefined;
  };

  // Handle field blur with validation
  const handleBlur = (field: FormFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const value = getFieldValue(field);
    const error = validateField(field, value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle field change with validation
  const handleFieldChange = (field: FormFields, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        // Only allow numbers
        const numericValue = value.replace(/\D/g, '');
        setPhone(numericValue);
        break;
      case 'password':
        setPassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
        // Show password strength bar when password is entered
        if (value.length > 0) {
          setShowPasswordStrength(true);
        } else {
          setShowPasswordStrength(false);
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }

    if (touchedFields[field]) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  function validateForm() {
    const errors: ValidationErrors = {};
    let hasErrors = false;

    // Validate all fields
    const fields: FormFields[] = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    fields.forEach(field => {
      const value = getFieldValue(field);
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    return hasErrors;
  }

  async function handleSignUp() {
    // Show asterisks when signup button is clicked
    setShowAsterisks(true);
    
    if (validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting signup with:', { email, firstName, lastName });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple mock validation
      if (email && password && firstName && lastName && password.length >= 6) {
        // Store a mock token
        await storeToken("mock_token_" + Date.now());
        console.log('Mock signup successful, token stored');
        
        // Navigate to home page on success (user is now logged in)
        router.push("/(dashboard)/home");
      } else {
        setError("Please fill in all fields and ensure password is at least 6 characters");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Style helper for labels and inputs
  const getLabelStyle = (field: FormFields) => [
    styles.label,
    isFieldInvalid(field, getFieldValue(field)) && styles.labelError
  ];

  const getInputStyle = (field: FormFields) => [
    styles.input,
    isFieldInvalid(field, getFieldValue(field)) && styles.inputError
  ];

  // Helper to get field value
  const getFieldValue = (field: FormFields): string => {
    switch (field) {
      case 'firstName':
        return firstName;
      case 'lastName':
        return lastName;
      case 'email':
        return email;
      case 'phone':
        return phone;
      case 'password':
        return password;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
    }
  };

  // Helper function to check if a field is invalid
  const isFieldInvalid = (field: FormFields, value: string) => {
    if (!touchedFields[field]) return false;
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        return !value.trim();
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/;
        return !emailRegex.test(value);
      case 'password':
        return !value || value.length < 6;
      case 'confirmPassword':
        return !value || value !== password;
      case 'phone':
        return !value || !/^\d{10}$/.test(value.replace(/\D/g, ''));
      default:
        return false;
    }
  };

  const handleCountryPickerPress = () => {
    if (countryPickerRef.current) {
      countryPickerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setPickerPosition({
          top: pageY + height,
          left: pageX,
          width: width
        });
        setShowCountryPicker(true);
      });
    }
  };

  const onSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    setSearchQuery('');
  };

  const renderCountryItem = ({ item }: { item: CountryData }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => onSelectCountry(item)}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.countryCode}>+{item.dialCode}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
              <Animated.View style={animatedStyle}>
          <ImageBackground
            source={require("../../../assets/images/signup-bg.png")}
            style={[StyleSheet.absoluteFill, styles.backgroundImage]}
            resizeMode="cover"
          />

          {/* Top Text Positioned Above the Card */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>
              <Text style={styles.headingHighlight}>Signup.{"\n"}</Text>
              See through AI{"\n"}
              edits!
            </Text>
          </View>
        <BottomCard height={height * 0.78} title="Signup to continue">
          <View style={styles.form}>
            {/* First Name */}
            <Text style={getLabelStyle('firstName')}>First Name {showAsterisks && <Text style={styles.required}>*</Text>}</Text>
            <TextInput
              style={getInputStyle('firstName')}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={(text) => handleFieldChange('firstName', text)}
              onBlur={() => handleBlur('firstName')}
            />

            {/* Last Name */}
            <Text style={getLabelStyle('lastName')}>Last Name {showAsterisks && <Text style={styles.required}>*</Text>}</Text>
            <TextInput
              style={getInputStyle('lastName')}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={(text) => handleFieldChange('lastName', text)}
              onBlur={() => handleBlur('lastName')}
            />

            {/* Email */}
            <Text style={getLabelStyle('email')}>Email {showAsterisks && <Text style={styles.required}>*</Text>}</Text>
            <TextInput
              style={getInputStyle('email')}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => handleFieldChange('email', text)}
              onBlur={() => handleBlur('email')}
            />

            {/* Phone */}
            <Text style={getLabelStyle('phone')}>Phone Number {showAsterisks && <Text style={styles.required}>*</Text>}</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                ref={countryPickerRef}
                style={styles.countryCodeButton}
                onPress={handleCountryPickerPress}
              >
                <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCodeText}>
                  +{selectedCountry.dialCode}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#000" />
              </TouchableOpacity>
              <TextInput
                style={[getInputStyle('phone'), styles.phoneInput]}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                onBlur={() => handleBlur('phone')}
                maxLength={10}
              />
            </View>

            {/* Custom Country Picker Modal */}
            <Modal
              visible={showCountryPicker}
              transparent
              animationType="fade"
              onRequestClose={() => setShowCountryPicker(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setShowCountryPicker(false)}
              >
                <View
                  style={[
                    styles.countryPickerContainer,
                    {
                      top: pickerPosition.top,
                      left: pickerPosition.left,
                      width: Math.max(pickerPosition.width, 300)
                    }
                  ]}
                >
                  <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#666" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search country"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                    />
                  </View>
                  <FlatList
                    data={filteredCountries}
                    renderItem={renderCountryItem}
                    keyExtractor={(item) => item.code}
                    style={styles.countryList}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              </Pressable>
            </Modal>

            {validationErrors.phone && (
              <Text style={styles.errorText}>{validationErrors.phone}</Text>
            )}

            {/* Password */}
            <Text style={getLabelStyle('password')}>Password {showAsterisks && <Text style={styles.required}>*</Text>}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={getInputStyle('password')}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => handleFieldChange('password', text)}
                onBlur={() => handleBlur('password')}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={25}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {showPasswordStrength && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthMeter}>
                  <View 
                    style={[
                      styles.strengthBar, 
                      { 
                        width: `${(passwordStrength.score / 8) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}

            {validationErrors.password && (
              <Text style={styles.errorText}>{validationErrors.password}</Text>
            )}

            {/* Confirm Password */}
            <Text style={getLabelStyle('confirmPassword')}>Confirm Password {showAsterisks && <Text style={styles.required}>*</Text>}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={getInputStyle('confirmPassword')}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                onBlur={() => handleBlur('confirmPassword')}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility-off" : "visibility"}
                  size={25}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupButton, loading && { opacity: 0.6 }]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Footer Text */}
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => router.push("/welcome")}
              >
                Login
              </Text>
            </Text>
          </View>
        </BottomCard>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    transform: [{ translateY: -height * 0.55 }],
  },
  textContainer: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: height * 0.805, // height * 0.78 + ~2.5% for spacing
  },
  heading: {
    fontSize: 34,
    color: "#1a1a1a",
    fontFamily: "Poppins-Black",
    fontWeight: "900",
    letterSpacing: -1.0,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 42,
  },
  headingHighlight: {
    color: "#FF2628",
    fontFamily: "Poppins-Black",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1.2,
    textShadowColor: 'rgba(255, 38, 40, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  form: {
    marginTop: 5,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 17,
    color: "#1f2937",
    marginBottom: 8,
    fontFamily: "SpaceMono",
    marginLeft: 6,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 17,
    backgroundColor: "transparent",
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    letterSpacing: -0.1,
    color: "#1f2937",
  },
  inputWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12.5,
  },
  signupButton: {
    backgroundColor: "#FF2628",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Black",
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footerText: {
    fontSize: 17,
    textAlign: "center",
    color: "#4b5563",
    marginTop: 18,
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  footerLink: {
    color: "#FF2628",
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
    textDecorationLine: "underline",
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 38, 40, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  labelError: {
    color: '#FF3B30',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  required: {
    color: '#FF3B30',
    fontSize: 16,
  },
  strengthContainer: {
    marginTop: -10,
    marginBottom: 15,
  },
  strengthMeter: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
    fontFamily: "PoppinsMedium",
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginRight: 10,
    backgroundColor: 'transparent',
    minWidth: 100,
  },
  countryCodeText: {
    fontSize: 16,
    marginHorizontal: 5,
    fontFamily: "PoppinsMedium",
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  countryPickerContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 300,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
  countryList: {
    maxHeight: 250,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    fontFamily: "PoppinsMedium",
  },
});