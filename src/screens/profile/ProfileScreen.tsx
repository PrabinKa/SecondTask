import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import {Colors, IMAGE_PATH} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton, UserInputs, Loader, ErrorMessage} from '../../components';
import {AppContext} from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCurrentUser, getNewAccessToken} from '../../api/AuthApi';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {checkTokenExpiration} from '../../utils/TokenExipration';
import {decryptData, encryptData} from '../../utils/Encription';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const {height, width} = Dimensions.get('window');

interface UserInputsContainerProps {
  children: string;
  placeholder: string;
  icon?: string;
  secureTextEntry?: boolean;
  secureIcon?: string;
  onPress?: () => void;
  inputValue?: string;
}

const ProfileScreen = () => {
  const {
    container,
    screenHeaderWrapper,
    pressedItem,
    userImageWrapper,
    profileWrapper,
    imageStyles,
    userNameText,
    designationText,
    inputTitle,
  } = styles;

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const {tokenHandler, currentUser, token} = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');

  const [currentUserDetail, setCurrentUserDetail] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: '',
  });

  //updates passsword secureTextEntry
  const hanldePasswordSecurity = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  //container for userinput and title
  const UserInputsContainer = ({
    children,
    placeholder,
    icon,
    secureTextEntry,
    secureIcon,
    onPress,
    inputValue,
  }: UserInputsContainerProps) => {
    return (
      <View style={{marginTop: width * 0.04}}>
        <Text style={inputTitle}>{children}</Text>
        <UserInputs
          placeholder={placeholder}
          icon={icon}
          secureTextEntry={secureTextEntry}
          secureIcon={secureIcon}
          onPress={onPress}
          value={inputValue}
        />
      </View>
    );
  };

  useEffect(() => {
    currentUserAfterExpiration();
  }, []);

  //handles logout functionality
  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('access_token');
      await tokenHandler('');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentUserHandler = async () => {
    setIsLoading(true);
    try {
      await getCurrentUser(token)
        .then(response => {
          // console.log('res', response);
          if (!response.ok) {
            setModalError('Network Error! Try again.');
            setIsErrorVisible(true);
          }
          return response.json();
        })
        .then(data => {
          // console.log('data', data);
          const {email, firstName, lastName, password, image} = data;
          setCurrentUserDetail({
            ...currentUserDetail,
            email,
            firstName,
            lastName,
            password,
            profileImage: image,
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentUserAfterExpiration = async () => {
    setIsLoading(true);
    try {
      if (await checkTokenExpiration(token)) {
        await currentUserHandler();
      } else {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const decryptedRefreshToken = decryptData(
            refreshToken,
            'refresh_token',
          );
          try {
            await getNewAccessToken(decryptedRefreshToken)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Invalid Refresh Token');
                }
                return response.json();
              })
              .then(async data => {
                const {token, refreshToken: newRefreshToken} = data;
                await tokenHandler(token);
                await currentUserHandler();
                const encryptedRefreshToken = encryptData(
                  newRefreshToken,
                  'refresh_token',
                );
                await AsyncStorage.setItem(
                  'refresh_token',
                  encryptedRefreshToken,
                );
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          throw new Error('Invalid Refresh Token');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleErrorModal = () => {
    setIsErrorVisible(!isErrorVisible);
  };

  // const SkeletonLoader = () => {
  //   return (
  //     <View style={{flex: 1, paddingHorizontal: width * 0.06}}>
  //       <ShimmerPlaceHolder
  //         style={{
  //           paddingBottom: width * 0.08,
  //           paddingTop: 10,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //         }}>
  //         <ShimmerPlaceHolder
  //           style={{height: width * 0.3, width: width * 0.3  }}
  //         />
  //         <Text>User Name</Text>
  //         <Text>React Native</Text>
  //       </ShimmerPlaceHolder>
  //     </View>
  //   );
  // };

  // if (isLoading) {
  //   return <SkeletonLoader />;
  // }

  return (
    <SafeAreaView style={container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={screenHeaderWrapper}>
          <Pressable style={({pressed}) => pressed && pressedItem}>
            <Ionicons name="arrow-back" size={30} color={Colors.white} />
          </Pressable>
          <Pressable style={({pressed}) => pressed && pressedItem}>
            <Ionicons name="settings-outline" size={30} color={Colors.white} />
          </Pressable>
        </View>
        <View style={userImageWrapper}>
          <View style={profileWrapper}>
            {currentUserDetail.profileImage ? (
              <Image
                source={{uri: currentUserDetail.profileImage}}
                style={imageStyles}
              />
            ) : (
              <Image source={IMAGE_PATH.PROFILE} style={imageStyles} />
            )}
          </View>
          <Text style={userNameText}>
            {currentUserDetail.firstName &&
              currentUserDetail.lastName &&
              `${currentUserDetail.firstName} ${currentUserDetail.lastName}`}
          </Text>
          <Text style={designationText}>React Native</Text>
        </View>
        <UserInputsContainer
          placeholder="xxx@gmail.com"
          icon="mail"
          inputValue={currentUserDetail?.email}>
          Your Email
        </UserInputsContainer>
        <UserInputsContainer
          placeholder="9811......"
          icon="phone-portrait-outline">
          Phone Number
        </UserInputsContainer>
        <UserInputsContainer placeholder="www.gfx.com">
          Website
        </UserInputsContainer>
        <UserInputsContainer
          inputValue={currentUserDetail?.password}
          placeholder="xxxxxxxxx"
          icon="lock-closed"
          secureTextEntry={secureTextEntry}
          secureIcon={'eye-off-outline'}
          onPress={hanldePasswordSecurity}>
          Password
        </UserInputsContainer>
        <CustomButton
          onPress={() => {
            logoutHandler();
          }}>
          LOG OUT
        </CustomButton>
      </ScrollView>
      <Loader isLoading={isLoading} />
      <ErrorMessage
        isVisible={isErrorVisible}
        message={modalError}
        onClose={toggleErrorModal}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary_blue,
    paddingHorizontal: width * 0.06,
  },
  screenHeaderWrapper: {
    height: width * 0.2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pressedItem: {
    opacity: 0.3,
  },
  userImageWrapper: {
    paddingBottom: width * 0.08,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileWrapper: {
    height: width * 0.3,
    width: width * 0.3,
  },
  imageStyles: {
    height: '100%',
    width: '100%',
  },
  userNameText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: 'bold',
  },
  designationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
});
