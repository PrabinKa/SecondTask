import React, {ReactNode} from 'react';
import {
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {Colors} from '../../constants';

interface ButtonWithImageProps {
  children: ReactNode;
  imagePath: ImageProps;
}

const {height, width} = Dimensions.get('window');

const ButtonWithImage: React.FC<ButtonWithImageProps> = ({
  children,
  imagePath,
}) => {
  const {wrapper, imageWrapper, imageStyles, buttonText} = styles;
  return (
    <TouchableOpacity activeOpacity={0.5} style={wrapper}>
      <View style={imageWrapper}>
        <Image source={imagePath} style={imageStyles} />
      </View>
      <Text style={buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

export default ButtonWithImage;

const styles = StyleSheet.create({
  wrapper: {
    height: height * 0.06,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: height * 0.025
  },
  imageWrapper: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  imageStyles: {
    height: '100%',
    width: '100%',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.secondary_blue,
    marginHorizontal: 10,
  },
});
