import logo from './logo.svg';
import './App.css';
// import 'https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap';
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
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/' element={<TodoList />}></Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;


