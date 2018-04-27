import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,1)',
  },
  container_title: {
    position: 'absolute',
    zIndex: 2,
    top: 50,
    width: '100%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_title_font: {
    fontSize: 16,
    color: 'rgba(255,255,255,.8)',
  },

});

export default class ModalImages extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    initialPage: PropTypes.number,
    imageList: PropTypes.array,
    animationType: PropTypes.string,
    closeModal: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    initialPage: 0,
    imageList: [],
    animationType: 'fade',
    closeModal: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      initialPage: props.initialPage,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialPage !== nextProps.initialPage) {
      this.setState({ initialPage: nextProps.initialPage });
    }
  }

  onIndexChanged = (idx) => {
    this.setState({ initialPage: idx });
  }

  render() {
    const { visible, closeModal, imageList, animationType } = this.props;
    const { initialPage } = this.state;
    const len = imageList.length;
    return (
      <Modal
        animationType={animationType}
        onRequestClose={() => this.props.closeModal()}
        transparent={true}
        visible={visible}
      >
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <View style={styles.container}>
            <View style={styles.container_title}>
              <Text style={styles.container_title_font}>{`${initialPage + 1}/${len}`}</Text>
            </View>
            <Swiper
              style={{ flex: 1 }}
              horizontal={true}
              showsButtons={false}
              showsPagination={false}
              loop={false}
              index={initialPage}
              onIndexChanged={this.onIndexChanged}
            >
              {
                imageList.map(item =>
                  <TouchableWithoutFeedback onPress={() => closeModal()} key={item}>
                    <Image
                      style={{ flex: 1 }}
                      source={{ uri: item }}
                      resizeMode="contain"
                    />
                  </TouchableWithoutFeedback>
                )
              }
            </Swiper>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
