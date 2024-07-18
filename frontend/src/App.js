import { Route ,Routes} from 'react-router-dom';
import './App.css';
import { Appbar } from './components/Appbar';
import {Home} from './components/Home'
import Footer from './components/Footer';
import { Problems } from './pages/ProblemPage';
import {LoginPage} from './pages/login';
import Problem  from "./components/Problem";
import {SignupForm} from './pages/signup';
import { VerifyEmail } from './pages/verifyemail';
function App() {
  return (
    <div className={`w-screen min-h-screen bg-gray-900 relative flex flex-col font-inter`}>
      <Appbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/problems' element={<Problems/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='problems/:id' element={<Problem/>}/>
        <Route path='signup' element={<SignupForm/>}/>
        <Route path='verify-email' element={<VerifyEmail/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
