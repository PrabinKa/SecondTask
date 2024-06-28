import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignUpScreen } from '../../screens';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
    return(
        <Stack.Navigator initialRouteName='Log In' screenOptions={{
            headerShown: false,
        }} >
            <Stack.Screen name='Log In' component={LoginScreen} />
            <Stack.Screen name='Sign Up' component={SignUpScreen} />
        </Stack.Navigator>
    )
}

export default AuthStackNavigator;