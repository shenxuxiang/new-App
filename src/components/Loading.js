import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_box: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0,0,0,.6)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_box_item: {
    width: 8,
    height: 80,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,.8)',
    borderRadius: 4,
  },
});

export default class Loading extends PureComponent {
  constructor() {
    super();
    this.state = {
      isShow: true,
      animationValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const ani = Animated.timing(this.state.animationValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
    });
    Animated.loop(ani).start();
  }

  render() {
    return (
      <Modal
        animationType="fade"
        onRequestClose={() => this.setState({ isShow: false })}
        visible={this.state.isShow}
        transparent
      >
        <View style={styles.container}>
          <View style={styles.container_box}>
            <Animated.View
              style={[
                styles.container_box_item,
                {
                  transform: [
                    {
                      scaleY: this.state.animationValue.interpolate({
                        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.85, 1],
                        outputRange: [1, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.container_box_item,
                {
                  transform: [
                    {
                      scaleY: this.state.animationValue.interpolate({
                        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.85, 1],
                        outputRange: [0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1, 0.9],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.container_box_item,
                {
                  transform: [
                    {
                      scaleY: this.state.animationValue.interpolate({
                        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.85, 1],
                        outputRange: [0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1, 0.9, 0.8],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.container_box_item,
                {
                  transform: [
                    {
                      scaleY: this.state.animationValue.interpolate({
                        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.85, 1],
                        outputRange: [0.7, 0.6, 0.7, 0.8, 0.9, 1, 0.9, 0.8, 0.7],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
