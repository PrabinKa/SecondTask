import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput as TextInputType,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {Strings, Colors, IMAGE_PATH} from '../../constants';
import {CustomButton, UserInputs, Loader, ErrorMessage} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');

// const bcrypt = require('bcrypt');

interface SignupCredentialsInterface {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpScreenProps {
  navigation: any;
}

type PartialError = Partial<SignupCredentialsInterface>;

interface HandleErrorProps {
  errorMessage: string;
  input: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const {
    container,
    imageWrapper,
    imageStyles,
    screenTitleWrapper,
    registerTextStyles,
    createAccountText,
  } = styles;

  const nameRef = useRef<TextInputType>(null);
  const emailRef = useRef<TextInputType>(null);
  const passwordRef = useRef<TextInputType>(null);
  const confirmPasswordRef = useRef<TextInputType>(null);
  const [newPasswordSecure, setNewPasswordSecure] = useState<boolean>(true);
  const [rePasswordSecure, setRePasswordSecure] = useState<boolean>(true);
  const [signupCredentials, setSignupCredentials] =
    useState<SignupCredentialsInterface>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  const [errors, setErrors] = useState<PartialError>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorIsVisible, setErrorIsVisible] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [encryptedPass, setEncryptedPass] = useState<string>('');

  //update password secureTextEntry
  const handleNewPasswordSecurity = () => {
    setNewPasswordSecure(!newPasswordSecure);
  };

  //updates confirm password secureTextEntry
  const handleRePasswordSecurity = () => {
    setRePasswordSecure(!rePasswordSecure);
  };

  useEffect(() => {
    validateForm();
  }, [signupCredentials]);

  //form validation
  const validateForm = () => {
    let isValid = true;

    //username validation
    if (!signupCredentials.username) {
      handleError({errorMessage: 'Username is required.', input: 'username'});
      isValid = false;
    } else if (signupCredentials.username.length <= 6) {
      handleError({
        errorMessage: 'Username length must have greater than 6.',
        input: 'username',
      });
      isValid = false;
    } else {
      handleError({
        errorMessage: ' ',
        input: 'username',
      });
    }

    //email validation
    if (!signupCredentials.email) {
      handleError({errorMessage: 'Email Address is required.', input: 'email'});
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupCredentials.email)) {
      handleError({errorMessage: 'Email is Invalid.', input: 'email'});
      isValid = false;
    } else {
      handleError({
        errorMessage: ' ',
        input: 'email',
      });
    }

    //password validation
    if (!signupCredentials.password) {
      handleError({errorMessage: 'Password is required.', input: 'password'});
      isValid = false;
    } else if (signupCredentials.password.length <= 6) {
      handleError({
        errorMessage: 'Password length must have greater than 6.',
        input: 'password',
      });
      isValid = false;
    } else {
      handleError({
        errorMessage: ' ',
        input: 'password',
      });
    }

    //confirm password validation
    if (signupCredentials.confirmPassword !== signupCredentials.password) {
      handleError({
        errorMessage: `Password doesn't match.`,
        input: 'confirmPassword',
      });
      isValid = false;
    } else {
      handleError({
        errorMessage: ' ',
        input: 'confirmPassword',
      });
    }

    setIsFormValid(isValid);
  };

  //handle error message got from validateForm
  const handleError = ({errorMessage, input}: HandleErrorProps) => {
    setErrors(prev => ({...prev, [input]: errorMessage}));
  };


  //signup functionality handler
  const handleSignupForm = useCallback(async () => {
    // encryptPassword().then((pass: any) => {
    //   setEncryptedPass(pass);
    // });

    // const encryptedUserData = {...signupCredentials, password: encryptedPass};


    if (isFormValid) {
      setIsLoading(true);
      try {
        const key = 'user_data';
        const existingUserData = await AsyncStorage.getItem(key);
        let userDataArray = [];
        if (existingUserData !== null) {
          userDataArray = JSON.parse(existingUserData);
        }
        userDataArray.push(signupCredentials);
        const updatedUserDataString = JSON.stringify(userDataArray);
        await AsyncStorage.setItem(key, updatedUserDataString);
        ToastAndroid.show('SignedUp Successfully!', ToastAndroid.BOTTOM);
        navigation.navigate('Log In');
      } catch (error) {
        setModalError(`Error signing up ${error}`);
        setErrorIsVisible(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setModalError(`Invalid form, check again.`);
      setErrorIsVisible(true);
    }
  }, [isFormValid]);

  const toggleErrorModal = () => {
    setErrorIsVisible(!errorIsVisible);
  };

  return (
    <SafeAreaView style={container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={imageWrapper}>
            <Image source={IMAGE_PATH.PREVIOUS} style={imageStyles} />
          </TouchableOpacity>
          <View style={screenTitleWrapper}>
            <Text style={registerTextStyles}>Register</Text>
            <Text style={createAccountText}>Create your account</Text>
          </View>
          <UserInputs
            inputRef={nameRef}
            placeholder="Username"
            icon="person"
            onChangeText={text =>
              setSignupCredentials({...signupCredentials, username: text})
            }
            returnKeyType="next"
            onSubmitEditing={() => {
              if (emailRef.current) {
                emailRef.current.focus();
              }
            }}
            error={errors.username}
          />
          <UserInputs
            inputRef={emailRef}
            placeholder="Email Address"
            icon="mail"
            onChangeText={text =>
              setSignupCredentials({...signupCredentials, email: text})
            }
            returnKeyType="next"
            onSubmitEditing={() => {
              if (passwordRef.current) {
                passwordRef.current.focus();
              }
            }}
            error={errors.email}
          />
          <UserInputs
            inputRef={passwordRef}
            placeholder="Password"
            icon="lock-closed"
            secureIcon={'eye-off-outline'}
            onPress={handleNewPasswordSecurity}
            secureTextEntry={newPasswordSecure}
            onChangeText={text =>
              setSignupCredentials({...signupCredentials, password: text})
            }
            returnKeyType="next"
            onSubmitEditing={() => {
              if (confirmPasswordRef.current) {
                confirmPasswordRef.current.focus();
              }
            }}
            error={errors.password}
          />
          <UserInputs
            inputRef={confirmPasswordRef}
            placeholder="Confirm password"
            icon="lock-closed"
            secureIcon={'eye-off-outline'}
            onPress={handleRePasswordSecurity}
            secureTextEntry={rePasswordSecure}
            onChangeText={text =>
              setSignupCredentials({
                ...signupCredentials,
                confirmPassword: text,
              })
            }
            returnKeyType="done"
            error={errors.confirmPassword}
          />
          <View style={{marginTop: width * 0.2}}>
            <CustomButton onPress={handleSignupForm}>REGISTER</CustomButton>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <Loader isLoading={isLoading} />
      <ErrorMessage
        isVisible={errorIsVisible}
        message={modalError}
        onClose={toggleErrorModal}
      />
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.09,
    backgroundColor: Colors.primary_blue,
  },
  welcomeText: {
    fontSize: height * 0.035,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginTop: width * 0.15,
    letterSpacing: 1.5,
  },
  imageWrapper: {
    height: 40,
    width: 40,
    marginVertical: width * 0.05,
  },
  imageStyles: {
    height: '100%',
    width: '100%',
    tintColor: Colors.white,
  },
  screenTitleWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: width * 0.25,
  },
  registerTextStyles: {
    fontSize: 42,
    color: Colors.white,
    fontWeight: '600',
    letterSpacing: 2,
  },
  createAccountText: {
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 1.5,
    marginVertical: width * 0.05,
  },
});
