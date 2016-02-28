
var TodoForm = React.createClass( {
    getInitialState: function() {
     return {due: '', description: ''};
    },
    handleDueDate: function( e ) {
      console.log("should handle due date change");
      this.setState({due: e.target.value});

    },
    handleTodo: function( e ){
      console.log("should handle todo change");
      this.setState({description: e.target.value});

    },
    handleSubmit: function( e ) {
      console.log("should handle the submit");
      e.preventDefault();
      var due = this.state.due.trim();
      var description = this.state.description.trim();
      if (!due || !description) {
        return;
      }
      this.props.onTodoSubmit({due: due, description: description});
      this.setState({due: '', description: ''});

    },
    render: function() {
      return (
        <form className="todoForm" onSubmit={this.handleSubmit}>
          <input type="text"
            placeholder="Due Date"
            onChange={this.handleDueDate}
            />
          <input type="text"
            placeholder="Todo..."
            onChange={this.handleTodo}/>
          <input type="submit" value="Save" />
        </form>
      );
    }

});


var Todo = React.createClass( {

    render: function(){
      var key=this.props.key;
      var description = this.props.description;
      var due=this.props.due;
      return (
          <p className="todo"> {key}: {due} --> {description} </p>
      );
    }
 });


var TodoList = React.createClass( {
  render: function() {
    var todos = this.props.todos.map( function(todo){
        return (
          <Todo key={todo.id} description={todo.description} due={todo.due} />
        );
    });
    return (
      <div className="TodoList">
        {todos}
      </div>
    );
  }

});

var TodoBox = React.createClass( {
  getInitialState: function() {
    this.todos=[];
    return {todos: []};
  },
  componentWillMount: function() {
    console.log("booting todobox");
    this.firebaseRef = new Firebase("https://todo-react-auth0.firebaseio.com/todos");
    this.firebaseRef.on("child_added", function(dataSnapshot) {
      this.todos.push(dataSnapshot.val());
      this.setState({
        todos: this.todos
      });
      console.log("state changed");
    }.bind(this));
    console.log("booted");
  },
  handleTodoSubmit: function( tododata ) {
    console.log("from the box to manage the todo submit");
    this.firebaseRef.push( tododata );
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  render: function() {
    return (
      <div className="TodoBox">

        <TodoList todos={this.state.todos}/>
        <TodoForm onTodoSubmit={this.handleTodoSubmit}/>

      </div>
    );
  }
});

ReactDOM.render(
  <TodoBox/>, document.getElementById('app')
);
