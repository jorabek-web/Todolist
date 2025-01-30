import { useEffect, useState } from "react"
import { FaCheck, FaPlus } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';


function App() {

  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [compLength, setCompLength] = useState(0)
  const [todoLength, setTodoLength] = useState(0)
  const [edit, setEdit] = useState(false)
  const [dark, setDark] = useState(true)

  function getData() {
    return fetch('http://localhost:3000/todos')
      .then(res => res.json())
      .then((data) => setTodos(data))
  }

  async function addTodo(calback) {
    if (inputValue !== "") {
      await fetch(`http://localhost:3000/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uuidv4(), text: inputValue, completed: false })
      })
      setInputValue("")
      getData()
      calback()
    }
  }

  async function editTodo(id, editValue, comp) {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editValue, completed: comp })
    })
    setEdit(false)
    getData()
  }

  async function deleteTodo(id, calback) {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE'
    })
    getData()
    calback()
  }

  async function checkedTodo(id, bolean, text, calback) {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: bolean, text: text })
    })
    getData()
    calback()
  }

  function lengthTodo() {
    let completedCounter = 0
    let todoCounter = 0
    todos.map(item => item.completed === true ? completedCounter++ : todoCounter++)
    setCompLength(completedCounter)
    setTodoLength(todoCounter)
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    lengthTodo()
  }, [todos])

  return (
    <>
      <div className={`min-h-screen flex flex-col items-center justify-center ${dark ? "bg-[#0D0714]" : "bg-[#3E1671]"} text-white p-4`}>
        <button
          onClick={() => setDark(!dark)}
          className={`absolute top-[20px] right-[20px] rounded-md text-white p-2 ${dark ? "bg-[#3E1671]" : "bg-[#6636a5]"}`}
        >Mode</button>
        <div className="w-full max-w-md">
          <div className="flex items-center space-x-2 mb-4">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? addTodo(lengthTodo) : ""}
              type="text"
              className={`flex-1 p-3 text-lg rounded-xl outline-none bg-transparent text-white border ${dark ? "border-[#3E1671]" : "border-[#6636a5] placeholder:text-white"}`}
              placeholder="Add a new task"
            />
            <button onClick={() => addTodo(lengthTodo)} className={`p-4 rounded-xl ${dark ? "bg-[#3E1671]" : "bg-[#6636a5]"}`}>
              <FaPlus />
            </button>
          </div>
          <div>
            <h2 className="mb-2 text-lg mt-14">Tasks to do - {todoLength}</h2>
            {todos.map((item) => {
              if (item.completed === false) {
                return <div key={item.id} id={item.id} className={`flex items-center justify-between px-[21px] py-[22px] ${dark ? "bg-[#15101C] text-[#9E78CF]" : "bg-[#773dc4] text-white"} rounded-xl mb-2`}>
                  {edit === false ? (
                    <p onClick={() => setEdit(true)}>{item.text}</p>
                  ) : (
                    <input type="text" className="outline-[#3E1671]" defaultValue={item.text} onKeyDown={(e) => e.key === 'Enter' && editTodo(item.id, e.target.value, item.completed)} />
                  )}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => checkedTodo(item.id, true, item.text, lengthTodo)}
                      className="hover:text-[#3E1671]">
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => deleteTodo(item.id, lengthTodo)}
                      className="hover:text-[#3E1671]">
                      <FiTrash />
                    </button>
                  </div>
                </div>
              }
            })}
          </div>
          <div>
            <h2 className="mt-10 mb-2 text-lg">Done - {compLength}</h2>
            {todos.map((item) => {
              if (item.completed === true) {
                return <div key={item.id} className={`flex items-center justify-between line-through px-[21px] py-[22px] ${dark ? "bg-[#15101C] text-[#78CFB0]" : "bg-[#773dc4] text-white"} rounded-xl mb-2`}>
                  <p>{item.text}</p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => checkedTodo(item.id, false, item.text, lengthTodo)}
                      className="hover:text-[#3E1671]">
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => deleteTodo(item.id, lengthTodo)}
                      className="hover:text-[#3E1671]">
                      <FiTrash />
                    </button>
                  </div>
                </div>
              }
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
