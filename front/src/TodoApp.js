import React, { Component } from 'react'
import axios from 'axios'
import './Todo.css'

const NavBar = () => {
    return (<nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">The React Todo List</span>
    </nav>)
}

const List = ({ todos, check}) => {
    return todos.map(todo => {
        return <Todo key={todo._id} todo={todo} check={check}/>
    })
}

const Todo = ({ todo, check }) => {
    return (
        <ul className="no-padding">
            <li className="list-unstyled">
                <label onClick={() => check(todo)}>{todo.text}</label>
            </li>
            <hr />
        </ul>
    )
}

const Done = ({list, check, delet}) => {
    return list.map(todo => {
        return (
            <ul id="done-items" className="list-unstyled" key={todo._id}>
                <li className="list-unstyled done" >
                    <label onClick={() => check(todo)}>{todo.text}</label>
                    <button  className="btn float-right paddingZero" onClick={() => delet(todo._id)}><i aria-hidden="true" className="fa fa-trash red"></i></button>
                </li>
                <hr />
            </ul>
        )
    }) 
}

export default class TodoApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            done: [], 
            input: ''
        }
    }

    componentDidMount() {
        this.fetch()
    }

    add = (e) => {
        if (e.key === 'Enter') {
            let todo = { text: this.state.input, isCompleted: false }
            axios.post('http://localhost:4000/todos/add', todo)
                .then(res => {
                    console.log(res.data)
                    this.fetch()
                })
            e.target.value = ''
        } 
    }

    check = (todo) => {
        axios.put(`http://localhost:4000/todos/${todo._id}`, todo)
        .then(res => {
            console.log(res.data)
            this.fetch()
        })
    }

    delete = (id) => {
        axios.delete(`http://localhost:4000/todos/${id}`)
        .then(res => {
            console.log(res.data)
            this.fetch()
        })
    }

    fetch = () => {
        axios.get('http://localhost:4000/todos')
        .then(res => {
            this.filter(res.data)
        })
    }

    filter = (all) => {
        let todos = all.filter(todo => {
            return !todo.isCompleted
        })
        let done = all.filter(todo => {
            return todo.isCompleted
        })

        this.setState({
            todos: todos, 
            done : done
        })
    }

    onChange = (input) => {
        this.setState({ input: input })
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container">
                    <br />
                    <div className="row">

                        <div className="col-md-6">
                            <div className="todolist not-done">
                                <input type="text" className="form-control add-todo btn-lg" placeholder="Add todo" 
                                onChange={(e) => this.onChange(e.target.value)}
                                onKeyDown={(e) => this.add(e, this.state.input)}/>
                                <br />
                                <List 
                                    todos={this.state.todos} 
                                    check={this.check}/>
                                <div className="todo-footer">
                                    <strong><span className="count-todos">{this.state.todos.length}</span></strong> Items Left
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="todolist">
                                <h3>Done</h3>
                                <Done list={this.state.done} check={this.check} delet={this.delete}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}