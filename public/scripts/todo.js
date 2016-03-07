var LoggedIn = React.createClass({
  getInitialState: function() {
    return {
      profile: null
    }
  },

  componentDidMount: function() {
    // In this case, the lock and token are retrieved from the parent component
    // If these are available locally, use `this.lock` and `this.idToken`
    this.props.lock.getProfile(this.props.idToken, function (err, profile) {
      if (err) {
        console.log("Error loading the Profile", err);
        return;
      }
      this.setState({profile: profile});
      this.props.profileHandler( profile );
    }.bind(this));
  },

  render: function() {
    if (this.state.profile) {
      return (
        <div className='userprofile'>
            <img src={this.state.profile.picture} className='avatar'/>
            Welcome {this.state.profile.given_name} {this.state.profile.family_name}
        </div>
      );
    } else {
      return (
        <div className="loading">Loading profile</div>
      );
    }
  }
});

var Home = React.createClass({
  // ...
  showLock: function() {
    // We receive lock from the parent component in this case
    // If you instantiate it in this component, just do this.lock.show()
    this.props.lock.show();
  },

  render: function() {
    return (
    <div className="login-box">
      <a onClick={this.showLock}>Sign In</a>
    </div>);
  }
});

var TodoList = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.todos.map(createItem) }</ul>;
  }
});

var TodoBox = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      todos: [],
      text: ''
    };
  },

  componentWillMount: function() {
    this.lock = new Auth0Lock('JuyBXARCpO8QsruysCA1uqFFZfOsUUGf', 'makkina.eu.auth0.com');





    //Auth0
    this.setState({idToken: this.getIdToken()})

  },
  getIdToken: function() {
    var idToken = localStorage.getItem('userToken');
    var authHash = this.lock.parseHash(window.location.hash);
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('userToken', authHash.id_token);
      }
      if (authHash.error) {
        console.log("Error signing in", authHash);
        return null;
      }
    }
    return idToken;
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  firebase: function( profile ){
    if (profile!=null)
       this.firebaseRef = new Firebase('https://todo-react-auth0.firebaseio.com/todos/'+profile.user_id);
    else return this.firebaseRef;
  },

  removeItem: function(key) {
    //var firebaseRef = new Firebase('https://todo-react-auth0.firebaseio.com/todos/'+this.profile.user_id);
    this.firebase().child(key).remove();
  },
  profileHandler: function( profile ){
    console.log("setting profile: "+profile.user_id);
    this.profile=profile;
    //set the current profile to database
    this.firebase(profile);

    //var firebaseRef = new Firebase('https://todo-react-auth0.firebaseio.com/todos/'+profile.user_id);
    this.bindAsArray(this.firebase(), 'todos');

  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRefs['todos'].push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  },

  logout: function (e){
      localStorage.removeItem("userToken");
      window.location.hash = "";
      this.setState({idToken: ''});
  },

  render: function() {

    if (this.state.idToken) {
          return (
            <div>
              <LoggedIn lock={this.lock} idToken={this.state.idToken} profileHandler={this.profileHandler}/>


              <TodoList todos={ this.state.todos } removeItem={ this.removeItem } />
              <form onSubmit={ this.handleSubmit }>
                <input onChange={ this.onChange } value={ this.state.text } />
                <button>{ 'Add #' + (this.state.todos.length + 1) }</button>
              </form>

              <br/>
              <a onClick={ this.logout }>Sign Out</a>
            </div>
          );
        } else {
          return (<Home lock={this.lock} />);
    }

  }
});


ReactDOM.render(<TodoBox />, document.getElementById('app'));
