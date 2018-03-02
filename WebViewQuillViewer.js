/********************************************
 * WebViewQuillViewer.js
 * A Delta viewer suitable for viewing output from a Quill.js
 * editor.  The Delta format is discussed here: https://quilljs.com/docs/delta/
 * This component is useful for applications that must avoid using native code
 *
 */
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  WebView,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
const reactHtml = require('./assets/dist/reactQuillViewer-index.html');
/* const bundle = require('./assets/dist/editor.bundle.js');
const common = require('./assets/dist/common.js'); */

const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillViewer extends React.Component {
  constructor() {
    super();
    this.webview = null;
    this.state = {
      webViewNotLoaded: true // flag to show activity indicator
    };
  }

  componentDidMount = () => {
    // this.downloadWebViewFiles(FILES_TO_DOWNLOAD);
  };

  sendContentToViewer = delta => {
    if (this.props.hasOwnProperty('contentToDisplay')) {
      this.sendMessage('SET_CONTENTS', {
        ops: delta.ops
      });
    }
  };

  sendMessage = (type, payload) => {
    // only send message when webview is loaded
    if (this.webview) {
      console.log(`WebViewQuillViewer: sending message ${type}`);
      this.webview.postMessage(
        JSON.stringify({
          prefix: MESSAGE_PREFIX,
          type,
          payload
        }),
        '*'
      );
    }
  };

  webViewLoaded = () => {
    console.log('Webview loaded');
    this.setState({ webViewNotLoaded: false });

    // send content to viewer if any was passed
    if (this.props.hasOwnProperty('contentToDisplay')) {
      console.log(this.props.contentToDisplay);
      this.sendMessage('SET_CONTENTS', {
        payload: {
          ops: this.props.contentToDisplay.ops
        }
      });
    }
  };

  createWebViewRef = webview => {
    this.webview = webview;
  };

  handleMessage = event => {
    console.log('WebViewQuillViewer handleMessage');
  };

  showLoadingIndicator = () => {
    return (
      <View style={styles.activityOverlayStyle}>
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            size="large"
            animating={this.state.webViewNotLoaded}
            color="green"
          />
        </View>
      </View>
    );
  };

  onError = error => {
    Alert.alert('WebView onError', error, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  renderError = error => {
    Alert.alert('WebView renderError', error, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffebba'
        }}
      >
        <WebView
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#ffebba',
            padding: 10
          }}
          ref={this.createWebViewRef}
          source={reactHtml}
          onLoadEnd={this.webViewLoaded}
          onMessage={this.handleMessage}
          startInLoadingState={true}
          renderLoading={this.showLoadingIndicator}
          renderError={this.renderError}
          onError={this.onError}
        />
      </View>
    );
  };
}

WebViewQuillViewer.propTypes = {
  contentToDisplay: PropTypes.object
};

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 20,
    marginVertical: 60,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5
  },
  activityIndicatorContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});
