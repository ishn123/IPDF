import React,{useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Toaster,toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar'
function Signup() {
    const navigate=useNavigate();
    const [username, setUsername] = useState('');
    const [pass,setpass]=useState('');
    const [email, setemail] = useState('');
    const ref = useRef(null);
    const handleInputChange = (e) => {
      setemail(e.target.value);
    };
  
    const handleSubmit = async(e) => {
        ref.current.continuousStart();
      e.preventDefault();
      const userData = {username:username,password:pass,email:email};
      const res = await fetch("https://test-back-jeji.onrender.com/signup",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(userData)
      })
      if(res.status===201){
        ref.current.complete();
        toast('User created succesfully',
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
        setUsername("");
        setpass("");
        setemail("");

        navigate("/signin");
      }else{
        toast.error('User already exist',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
        );
      }
    };
    return (
        <>
        <Toaster></Toaster>
        <LoadingBar color='white' ref={ref} />

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
    </>
    );
}

export default Signup
