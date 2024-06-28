import React, {ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Colors} from '../../constants';

const {height, width} = Dimensions.get('window');

interface CustomButtonProps {
  children: ReactNode;
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({children, onPress}) => {
  const {container, buttonText} = styles;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={container}>
      <Text style={buttonText} >{children}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    height: height * 0.06,
    width: '100%',
    backgroundColor: Colors.secondary_blue,
    borderRadius: 30,
    marginVertical: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginHorizontal: 20,
    letterSpacing: 1.5
  }
});
