import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Task Managament/Login';
import Register from './Task Managament/Register';
import TodoList from './Task Managament/TodoList';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/TodoList' element={<TodoList />}></Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;


