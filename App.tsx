import React from 'react';
import {StatusBar} from 'react-native';
import {Colors} from './src/constants';
import RootNavigator from './src/navigation/root-nav/RootNavigator';
import ContextProvider from './src/context/AppContext';

function App() {
  return (
    <ContextProvider>
      <StatusBar backgroundColor={Colors.primary_blue} />
      <RootNavigator />
    </ContextProvider>
  );
}

export default App;
