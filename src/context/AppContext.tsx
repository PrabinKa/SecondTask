import React, {createContext, ReactNode, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decryptData, encryptData} from '../utils/Encription';

interface ContextProviderProps {
  children: ReactNode;
}

interface UserDataInterface {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const AppContext = createContext({
  isLoading: false,
  token: '',
  tokenHandler: (prop: string) => {},
  registeredUserData: [] as UserDataInterface[],
  currentUser: {} as UserDataInterface,
  handleCurrentUserData: (prop: UserDataInterface) => {},
});

const ContextProvider: React.FC<ContextProviderProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [registeredUserData, setRegisteredUserData] = useState<
    UserDataInterface[]
  >([]);
  const [currentUser, setCurrentUser] = useState<UserDataInterface>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  //store and delete token when user login and logout
  const tokenHandler = async (token: string) => {
    try {
      if (token) {
        setToken(token);
        const encryptedToken = encryptData(token, 'token');
        await AsyncStorage.setItem('access_token', encryptedToken);
      } else {
        setToken(token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveUserData();
  }, []);

  //retrieve all signedup users data
  const retrieveUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('user_data');
      if (data) {
        setRegisteredUserData(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle current loggedin user data
  const handleCurrentUserData = (data: UserDataInterface) => {
    setCurrentUser(data);
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        token,
        tokenHandler,
        registeredUserData,
        currentUser,
        handleCurrentUserData,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
