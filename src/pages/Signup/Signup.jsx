import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate=useNavigate();
    const [username, setUsername] = useState('');
    const [pass,setpass]=useState('');
    const [email, setemail] = useState('');
    const handleInputChange = (e) => {
      setemail(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
    };
  
    return (
    <div className='Login-container'>
    <div className="twitter-container">
        <h1 style={{color:"aliceblue"}}>Query Me</h1>
        <button className="twitter-button">
            <img
                src="https://img.icons8.com/color/48/undefined/google-logo.png"
                alt="google logo"
                className="img"
            />
            <p>Sign up with Google</p>
        </button>
        <button className="twitter-button">
            <img
                src="https://img.icons8.com/ios-filled/50/undefined/mac-os.png"
                alt="apple logo"
                className="img"
            />
            <p>Sign up with Apple</p>
        </button>
        <p style={{color:"aliceblue"}}>or</p>
        <form className="twitter-form" onSubmit={handleSubmit}>
        <input
                type="text"
                placeholder="Username"
                size="22"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                className="twitter-input"
            />
            <input
                type="text"
                placeholder="Email"
                size="22"
                value={email}
                onChange={handleInputChange}
                className="twitter-input"
            />
             <input
                type="text"
                placeholder="Password"
                size="22"
                value={pass}
                onChange={(e)=>setpass(e.target.value)}
                className="twitter-input"
            />
            <input id="next" type="submit" value="Sign up" />
        </form>
        <p id="signup">
           Already have an account ? <a  onClick={() => navigate(`/signin`)}>Sign in</a>
        </p>
    </div>
    </div>
    );
}

export default Signup
