import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Pressable,
  TextInputProps,
  Text,
} from 'react-native';
import {Colors} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window');

interface UserInputsProps extends TextInputProps {
  inputRef?: any;
  onPress?: () => void;
  secureTextEntry?: boolean;
  secureIcon?: string;
  icon?: string;
  error?: string;
}

const UserInputs: React.FC<UserInputsProps> = ({
  inputRef,
  onPress,
  secureTextEntry,
  secureIcon,
  icon,
  error,
  ...props
}) => {
  const {container, textInputStyles, pressedItem} = styles;
  // console.log(error)
  return (
    <View>
      <View style={container}>
        {icon && (
          <View>
            <Ionicons name={icon} size={24} color={Colors.secondary_blue} />
          </View>
        )}
        <TextInput
          ref={inputRef}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={Colors.primary_blue}
          selectionColor={Colors.secondary_blue}
          style={[
            textInputStyles,
            {
              width: secureIcon ? '75%' : '100%',
              maxWidth: secureIcon ? '75%' : '100%',
            },
          ]}
          {...props}
        />
        {secureIcon && (
          <Pressable
            onPress={onPress}
            style={({pressed}) => pressed && pressedItem}>
            <Ionicons
              name={secureTextEntry ? secureIcon : 'eye-outline'}
              size={24}
              color={Colors.secondary_blue}
            />
          </Pressable>
        )}
      </View>
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default UserInputs;

const styles = StyleSheet.create({
  container: {
    height: height * 0.065,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
  },
  textInputStyles: {
    color: Colors.black,
    fontSize: 20,
    paddingHorizontal: 10,
  },
  pressedItem: {
    opacity: 0.5,
  },
});
