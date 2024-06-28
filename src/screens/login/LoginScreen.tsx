import React, {useState, useRef, useContext} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
  Pressable,
  View,
  TextInput as TextInputType,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Colors, IMAGE_PATH, Strings} from '../../constants';
import {
  ButtonWithImage,
  UserInputs,
  CustomButton,
  Loader,
  ErrorMessage,
} from '../../components';
import {AppContext} from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginHandler} from '../../api/AuthApi';
import {encryptData} from '../../utils/Encription';

const {width, height} = Dimensions.get('window');

interface LoginCredentialsInterface {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {
    container,
    wlecomeText,
    emailTextStyles,
    forgotPasswordText,
    haveAccountText,
    createAccountText,
    pressedItem,
    accountTextWrapper,
  } = styles;

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const emailRef = useRef<TextInputType>(null);
  const passwordRef = useRef<TextInputType>(null);
  const [loginCredentials, setLoginCredentials] =
    useState<LoginCredentialsInterface>({
      email: '',
      password: '',
    });
  const {tokenHandler, registeredUserData, handleCurrentUserData} =
    useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');

  //password secureTextEntry
  const handleScureText = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  //generates random number
  const generateRandomNumber = () => {
    const result = Math.floor(Math.random() * 1000);

    return result;
  };

  //login functionality handler
  const handleLogin = async () => {
    const {email, password} = loginCredentials;
    setIsLoading(true);

    try {
      await loginHandler(email, password)
        .then(response => {
          // console.log('login res', response)
          if (!response.ok) {
            setModalError(`Network error! Please try again.`);
            setIsErrorVisible(true);
          }

          return response.json();
        })
        .then(async data => {
          // console.log('login data', data)
          if (data.message) {
            setModalError(data.message);
            setIsErrorVisible(true);
          } else {
            const {refreshToken, token} = data;
            tokenHandler(token);

            const encryptedRefreshToken = encryptData(
              refreshToken,
              'refresh_token',
            );
            
            await AsyncStorage.setItem('refresh_token', encryptedRefreshToken);
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleErrorModal = () => {
    setIsErrorVisible(!isErrorVisible);
  };

  return (
    <SafeAreaView style={container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={wlecomeText}>{Strings.WELCOME}</Text>
          <ButtonWithImage imagePath={IMAGE_PATH.GOOGLE_ICON}>
            {Strings.GOOGLE}
          </ButtonWithImage>
          <ButtonWithImage imagePath={IMAGE_PATH.APPLE_ICON}>
            {Strings.APPLE}
          </ButtonWithImage>
          <ButtonWithImage imagePath={IMAGE_PATH.FACEBOOK_ICON}>
            {Strings.FACEBOOK}
          </ButtonWithImage>
          <Text style={emailTextStyles}>{Strings.OR_EMAIL}</Text>
          <UserInputs
            inputRef={emailRef}
            placeholder={'Email Address'}
            icon="mail"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={text =>
              setLoginCredentials({...loginCredentials, email: text})
            }
            onSubmitEditing={() => {
              if (passwordRef.current) {
                passwordRef.current.focus();
              }
            }}
          />
          <UserInputs
            inputRef={passwordRef}
            placeholder={'Password'}
            icon="lock-closed"
            secureIcon={'eye-off-outline'}
            onPress={handleScureText}
            secureTextEntry={secureTextEntry}
            returnKeyType="done"
            onChangeText={text =>
              setLoginCredentials({...loginCredentials, password: text})
            }
          />
          <Pressable style={({pressed}) => pressed && pressedItem}>
            <Text style={forgotPasswordText}>{Strings.FORGOT}</Text>
          </Pressable>
          <CustomButton
            onPress={() => {
              handleLogin();
            }}>
            {Strings.SIGN_IN}
          </CustomButton>
          <View style={accountTextWrapper}>
            <Text style={haveAccountText}>{Strings.HAVE_ACOOUNT}</Text>
            <Pressable
              onPress={() => navigation.navigate('Sign Up')}
              style={({pressed}) => pressed && pressedItem}>
              <Text style={createAccountText}>{Strings.CREATE_ACCOUNT}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <Loader isLoading={isLoading} />
      <ErrorMessage
        isVisible={isErrorVisible}
        message={modalError}
        onClose={toggleErrorModal}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.09,
    backgroundColor: Colors.primary_blue,
  },
  wlecomeText: {
    fontSize: height * 0.035,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginTop: width * 0.15,
    letterSpacing: 1.5,
  },
  emailTextStyles: {
    fontSize: height * 0.025,
    fontWeight: '400',
    marginVertical: height * 0.05,
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: Colors.white,
    fontSize: height * 0.02,
    fontWeight: '400',
    textAlign: 'right',
    marginTop: 10,
  },
  accountTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  haveAccountText: {
    fontSize: height * 0.02,
    fontWeight: '500',
    color: Colors.white,
  },
  createAccountText: {
    color: Colors.secondary_blue,
    fontSize: height * 0.022,
    fontWeight: 'bold',
    marginLeft: 8,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.secondary_blue,
  },
  pressedItem: {
    opacity: 0.5,
  },
});

// setIsLoading(true);
// try {
//   const matchedData = registeredUserData.find(
//     item => item.email == email && item.password == password,
//   );

//   if (matchedData) {
//     handleCurrentUserData(matchedData);
//     const accessToken = `${matchedData?.username}${generateRandomNumber()}`;

//     console.log(accessToken);
//     tokenHandler(accessToken);
//   } else {
//     setModalError(`Username and Password doesn't match`);
//     setIsErrorVisible(true);
//   }
// } catch (error) {
//   console.log(error);
// } finally {
//   setIsLoading(false);
// }
