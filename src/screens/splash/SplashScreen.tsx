import React, {useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {IMAGE_PATH} from '../../constants';
import {Colors} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../../context/AppContext';
import {decryptData} from '../../utils/Encription';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const {container, imageWrapper, imageStyles} = styles;
  const {tokenHandler} = useContext(AppContext);

  useEffect(() => {
    checkIsTokenAvailable();
  }, []);

  const checkIsTokenAvailable = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const decryptedToken = decryptData(token, 'token');
        tokenHandler(decryptedToken);
        navigation.replace('Main');
      } else {
        tokenHandler('');
        navigation.replace('Main');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={container}>
      <View style={imageWrapper}>
        <Image source={IMAGE_PATH.SPLASH} style={imageStyles} />
      </View>
      <ActivityIndicator size={'small'} color={Colors.white} />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary_blue,
  },
  imageWrapper: {
    height: 80,
    width: 80,
    overflow: 'hidden',
  },
  imageStyles: {
    height: '100%',
    width: '100%',
  },
});
