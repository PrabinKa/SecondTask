import React, {memo} from 'react';
import {StyleSheet, ActivityIndicator, View, Modal} from 'react-native';
import {Colors} from '../../constants';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({isLoading}) => {
  const {modalContainer, modalContent} = styles;

  return (
    <Modal animationType="fade" transparent={true} visible={isLoading}>
      <View style={modalContainer}>
          <ActivityIndicator size="large" color={Colors.secondary_blue} />
      </View>
    </Modal>
  );
};

export default memo(Loader);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    height: 100,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});
