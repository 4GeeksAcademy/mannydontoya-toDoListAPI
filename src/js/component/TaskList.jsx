import React, { useState, useEffect } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  function createTask() {
    let jsonTask = { label: newTask, is_done: false };
    fetch("https://playground.4geeks.com/todo/todos/danielmontoya", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonTask)
    }
    )
      .then(resp => {
        if (resp.ok) {
          getTodos();
          setNewTask('');
        } else createUser();
      });
  }
  function createUser() {
    fetch("https://playground.4geeks.com/todo/users/danielmontoya", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
    })
      .then(resp => { 

        if (!resp.ok){ 
          throw new Error("Error Creating User")
        } 

        createTask();

      })
      .catch(err => { console.log(err); })

  }
  function getTodos() {
    fetch("https://playground.4geeks.com/todo/users/danielmontoya")
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Something went wrong while getting todos");
        }
        return resp.json();
      })
      .then(result => {
        setTasks(result.todos);
      })
      .catch(() => {
        createUser();
      })
  }
  // setNewTask("Do math homework")
  // setTasks([...tasks, newTask])
  const clearAll = () => {
    fetch("https://playground.4geeks.com/todo/users/danielmontoya",{
      method: "DELETE"
    }
    )
    .then(resp =>{
      if(resp.ok){
        setTasks([])
      }
    })
  }
  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (event) => {
    let inptvalue = event.target.value
    setNewTask(inptvalue) 
  }
  const handleKeyDown = (event) => {
    let keyName = event.key
  if(keyName === 'Enter' && newTask.trim() !== ''){
    createTask();
    
      // setTasks([...tasks, jsonTask])
    }
  }
  const handleDelete = (idToBeDeleted) => {
    fetch(`https://playground.4geeks.com/todo/todos/${idToBeDeleted}`,{
      method: "DELETE"
    }
    )
    .then(resp =>{
      if(resp.ok){
        getTodos()
      }
    })
  }
  return <div className="container">
    <h1>To Do List </h1>
    <input type="text" value={newTask} onChange={handleChange} onKeyDown={handleKeyDown}/>
    {/* task.length ? is asking a question if tasks.length is true or false, 0 is false anything > 0 is true */}
    <p>{tasks.length ? `${tasks.length} item(s) left`:'No tasks, add a task'}</p> 
    <button onClick={clearAll} className="btn btn-danger">Clear all</button>
    <ul>
      {/* tasks == todos === [{label: string, id: 0, is_done: false }, {label: string, id: 0, is_done: false }] */}
      {tasks.map(   (todo, index) => (<li key={index}>
        {todo.label}
        <span onClick={() => handleDelete(todo.id)}> x</span>
      </li>)  ) } 
    </ul>
  </div>  


  


  


  
} 

// (task, idx) => { 
//   let val = 2

//   val = val + index

//   return (<li>{val}</li>)

// } 

// function (task, idx){
//   return <li></li>
// }

export default TaskList;