import {createStackNavigator} from '@react-navigation/stack';
import {ProfileScreen} from '../../screens';
import AuthStackNavigator from '../auth-stack/AuthStackNavigator';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const {token} = useContext(AppContext);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {token ? (
        <Stack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
