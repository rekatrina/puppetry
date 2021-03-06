import React from "react";
import log from "electron-log";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppLayout } from "../component/AppLayout";
import actions from "../action/actions";

const GREETINGS = [ "Greetings",
        "Hi there",
        "How's everything?",
        "How are things?",
        "Good to see you",
        "Great to see you",
        "Nice to see you",
        "How have you been?",
        "Nice to see you again.",
        "Greetings and salutations!",
        "How are you doing today?",
        "What have you been up to?",
        "How are you feeling today?"
      ],

      // Mapping state to the props
      mapStateToProps = ( state ) => ({ store: state }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class App extends React.Component {

  static propTypes = {
    action: PropTypes.shape({
      loadProject: PropTypes.func.isRequired,
      loadSettings: PropTypes.func.isRequired,
      loadProjectFiles: PropTypes.func.isRequired,
      checkRuntimeTestDirReady: PropTypes.func.isRequired,
      checkNewVersion: PropTypes.func.isRequired,
      updateApp: PropTypes.func.isRequired
    }),
    store: PropTypes.object
  }

  async componentDidMount() {
    const { loadProject,
            loadSettings,
            checkRuntimeTestDirReady,
            checkNewVersion,
            updateApp
          } = this.props.action,
          settings = loadSettings();

    updateApp({ greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length ) ] });
    checkRuntimeTestDirReady();
    checkNewVersion();

    if ( !settings.projectDirectory ) {
      return;
    }

    try {
      await loadProject();
    } catch ( e ) {
      log.warn( `Renderer process: App: ${ e }` );
      console.warn( e );
    }

  }


  render() {
    const { action, store } = this.props;
    return (
      <AppLayout action={action} store={store} />
    );
  }
}
