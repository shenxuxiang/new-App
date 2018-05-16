import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text,
  PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/zh-cn';

export default class UserListItem extends PureComponent {
  static typeProps = {
    navigation: PropTypes.object.isRequired,
    userName: PropTypes.string,
    sex: PropTypes.number,
    userEducation: PropTypes.string,
    userWorkingYears: PropTypes.number,
    companyName: PropTypes.string,
    jobName: PropTypes.string,
    avatorURI: PropTypes.string,
    userMobile: PropTypes.string,
  }
  static defaultProps = {
    userName: '',
    sex: 1,
    userEducation: '',
    userWorkingYears: 0,
    companyName: '',
    jobName: '',
    avatorURI: '',
    userMobile: '',
  }

  constructor() {
    super();
    this.state = {
      descriptionfontColor: 'rgba(0,0,0,.8)',
    };
  }

  onPressHandle = () => {
    this.setState({
      descriptionfontColor: '#999',
      titleFontColor: '#999',
    });
    this.props.navigation.navigate('UserDetail', { userMobile: this.props.userMobile });
  }

  render() {
    const {
      userName,
      sex,
      userEducation,
      userWorkingYears,
      companyName,
      jobName,
      avatorURI,
    } = this.props;
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="#d9d9d9"
        onPress={this.onPressHandle}
      >
        <View style={styles.conatiner_content}>
          <View style={styles.conatiner_content_img}>
            <Image
              style={styles.conatiner_content_img_con}
              source={{ uri: avatorURI || null }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.conatiner_content_con}>
            <View style={styles.conatiner_content_con_person}>
              <Text
                style={[
                  styles.conatiner_content_con_person_name,
                  { color: this.state.descriptionfontColor },
                ]}
              >{userName}
              </Text>
              <Text
                style={styles.conatiner_content_con_person_text}
              >{sex !== 1 ? '女' : '男'}
              </Text>
              {
                userEducation
                  ? <Text style={styles.conatiner_content_con_person_text}>{userEducation}</Text>
                  : null
              }

            </View>
            <View
              style={[
                styles.conatiner_content_con_work,
                { backfaceVisibility: !jobName && !userWorkingYears ? 'hidden' : 'visible' },
              ]}
            >
              {
                jobName
                  ? <Text style={styles.conatiner_content_con_work_job}>{jobName}</Text>
                  : null
              }
              {
                userWorkingYears
                  ? <Text style={styles.conatiner_content_con_person_text}>{userWorkingYears}年</Text>
                  : null
              }
            </View>
            {
              companyName
                ? <Text style={styles.conatiner_content_con_company}>{companyName}</Text>
                : null
            }
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  conatiner_content: {
    flex: 1,
    flexDirection: 'row',
  },
  conatiner_content_img: {
    width: 90,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  conatiner_content_img_con: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  conatiner_content_con: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
  },
  conatiner_content_con_person: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  conatiner_content_con_person_name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 5,
  },
  conatiner_content_con_person_text: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  conatiner_content_con_work: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  conatiner_content_con_work_job: {
    fontSize: 15,
    color: '#666',
    marginRight: 5,
  },
  conatiner_content_con_company: {
    width: '100%',
    lineHeight: 30,
    fontSize: 15,
    color: '#666',
  },
});
