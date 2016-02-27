var todo = [
  { id:1, description: "First todo", due: "today"},
  { id:2, description: "Second todo", due: "today"}
];


var Todo = React.createClass( {

    render: function(){
      var key=this.props.id;
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
  render: function() {
    return (
      <div className="TodoBox">
        <TodoList todos={todo}/>
      </div>
    );
  }
});

ReactDOM.render(
  <TodoBox />, document.getElementById('app')
);
