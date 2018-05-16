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
// import Swiper from 'react-native-swiper';
import ImageViewer from 'react-native-image-zoom-viewer';

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
      images: props.imageList.map(item => ({ url: item })),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialPage !== nextProps.initialPage) {
      this.setState({ initialPage: nextProps.initialPage });
    }
    if (nextProps.imageList !== this.props.imageList) {
      this.setState({ images: nextProps.imageList.map(item => ({ url: item })) });
    }
  }

  onIndexChanged = (idx) => {
    this.setState({ initialPage: idx });
  }

  render() {
    const {
      visible, closeModal, imageList, animationType,
    } = this.props;
    const { initialPage } = this.state;
    const len = imageList.length;
    return (
      <Modal
        animationType={animationType}
        onRequestClose={() => this.props.closeModal()}
        transparent
        visible={visible}
      >
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => closeModal()}>
              <ImageViewer
                imageUrls={this.state.images}
                onClick={() => closeModal()}
                index={initialPage}
                onSwipeDown={() => closeModal()}
              />
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
