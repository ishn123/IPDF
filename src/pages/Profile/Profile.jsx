import React, { useState, useEffect,useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./style.css";
import { FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import Modal from 'react-modal';
import LoadingBar from "react-top-loading-bar";
import emailjs from 'emailjs-com';
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
const generateRandomPassword = (length) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};
function Profile() {
  
  const savednotificationsJSON = localStorage.getItem("notifications");
  const navigate = useNavigate();
  const ref = useRef(null);
  const animatedComponents = makeAnimated();
  const savednotifications = savednotificationsJSON
    ? JSON.parse(savednotificationsJSON)
    : [];
  const [notification, setnotification] = useState(savednotifications);
  const savedcardsJSON = localStorage.getItem("cards");
  const handleupvote = (index) => {
    if (cards[index].isDownvoted == 0 && cards[index].isUpvoted == 0) {
      setnotification([
        ...notification,
        { text: "You just voted a question", createdAt: Date.now() },
      ]);
    }
    if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 1) {
      const tempcards = [...cards];
      const newcard = {
        id: cards[index].id,
        title: cards[index].title,
        postImg: cards[index].postImg,
        labels: [...cards[index].labels],
        answer: cards[index].answer,
        replies: [...cards[index].replies],
        votes: cards[index].votes + 1,
        createdAt: cards[index].createdAt,
        isUpvoted: 1,
        isDownvoted: 0,
      };
      tempcards[index] = newcard;
      setcards(tempcards);
      return;
    }
    if (cards[index].isDownvoted == 0 && cards[index].isUpvoted == 1) {
      return;
    }
    const tempcards = [...cards];
    const newcard = {
      id: cards[index].id,
      title: cards[index].title,
      postImg: cards[index].postImg,
      labels: [...cards[index].labels],
      answer: cards[index].answer,
      replies: [...cards[index].replies],
      votes: cards[index].votes + 1,
      createdAt: cards[index].createdAt,
      isUpvoted: 1,
      isDownvoted: cards[index].isDownvoted,
    };
    tempcards[index] = newcard;
    setcards(tempcards);
  };
  const handledownvote = (index) => {
    if (cards[index].isDownvoted == 0 && cards[index].isUpvoted == 0) {
      setnotification([
        ...notification,
        { text: "You just voted a question", createdAt: Date.now() },
      ]);
    }
    if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 1) {
      const tempcards = [...cards];
      const newcard = {
        id: cards[index].id,
        title: cards[index].title,
        postImg: cards[index].postImg,
        labels: [...cards[index].labels],
        answer: cards[index].answer,
        replies: [...cards[index].replies],
        votes: cards[index].votes - 1,
        createdAt: cards[index].createdAt,
        isUpvoted: 0,
        isDownvoted: 1,
      };
      tempcards[index] = newcard;
      setcards(tempcards);
      return;
    }
    if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 0) {
      return;
    }
    const tempcards = [...cards];
    const newcard = {
      id: cards[index].id,
      title: cards[index].title,
      postImg: cards[index].postImg,
      labels: [...cards[index].labels],
      answer: cards[index].answer,
      replies: [...cards[index].replies],
      votes: cards[index].votes - 1,
      createdAt: cards[index].createdAt,
      isUpvoted: cards[index].isUpvoted,
      isDownvoted: 1,
    };
    tempcards[index] = newcard;
    setcards(tempcards);
  };
  const savedcards = savedcardsJSON ? JSON.parse(savedcardsJSON) : [];
  const [cards, setcards] = useState(savedcards);
  const token = localStorage.getItem("user");
  const userJSON = localStorage.getItem("user");
  const userJs = userJSON
    ? JSON.parse(userJSON)
    : [];
  const tempuser = JSON.parse(token);
  const [userImg, setUserImg] = useState("");
  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
        console.log("img data", fileReader.result);
      }
    };
  }
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notification));
  }, [notification]);
  const handleedit = () => {
    setedit(!edit);
    // const newuser={
    //     img:userImg,
    //     name:tempuser.name,
    //     email:tempuser.email,
    //     password:tempuser.password,
    //     bio:tempuser.bio,
    //     occupation:tempuser.occupation
    //   };
    //   localStorage.setItem("user",JSON.stringify(newuser));
  };
  const [edit, setedit] = useState(false);
  const [name,setname]=useState("");
  const [isSending, setIsSending] = useState(false);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [bio, setbio] = useState("");
  const [occ, setOcc] = useState("");
  const [passwo, setpasswo] = useState("");
  const [verify,setverify]=useState(false);
  const handleRadioChange = (e) => {
    if(!verify&&e.target.value=="Teacher"){
      return;
    }
    setOcc(e.target.value);
     
  };
  const updateUser = async (event) => {
    event.preventDefault();
    const user = localStorage.getItem("user");

       if(Name||Email||passwo){
        ref.current.continuousStart();
    await fetch(
      `http://localhost:8000/updateUser/${JSON.parse(user).id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: Name != "" ? Name : JSON.parse(user).name,
          email: Email != "" ? Email : JSON.parse(user).email,
          password: passwo ? passwo : JSON.parse(user).password,
        }),
      }
    )
      .then((res) => {
        toast.success("User updated successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
         ref.current.complete();
      })
      .catch((err) =>
        toast.success("Server error", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })
      );
    }
    const newuser = {
      img: userImg
        ? userImg
        : "https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg",
      id: JSON.parse(user).id,
      name: Name != "" ? Name : JSON.parse(user).name,
      email: Email != "" ? Email : JSON.parse(user).email,
      password: passwo ? passwo : JSON.parse(user).password,
      bio: bio
        ? bio
        : "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela.",
      occupation: occ ? occ : "Student",
    };
    setedit(!edit);
    setnotification([
        ...notification,
        { text: "You just updated your profile", createdAt: Date.now() },
      ]);
    localStorage.setItem("user", JSON.stringify(newuser));
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleOpenDialog1 = () => {
    setIsDialogOpen1(true);
  };
  const handleCloseDialog1 = () => {
    setIsDialogOpen1(false);
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const [genpassword, setgenPassword] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const currentDateFormatted = formatDate(new Date());
    setCurrentDate(currentDateFormatted);
  }, []);
  const [checkpass,setcheckpass]=useState('');
  const handleSubmitDialog1 = () => {
    if(!checkpass){
      toast.error('Password cannot be empty',
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
      );
      return;
    }
    if(checkpass==localStorage.getItem('pass')){
      if(!name){
        toast.success('Verification successful',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
        );
        setOcc("Teacher");
        setIsDialogOpen1(false);
        setcheckpass('');
        return;
      }
    }
    else{
      if(!name){
        toast.error('Wrong Password',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
        );
        return;
      }
    }
  };
  const handleSubmitDialog = () => {
    if(!name){
      toast.error('Name cannot be empty',
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
      );
      return;
    }
    if(!inputValue){
      toast.error('Email cannot be empty',
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
      );
     return; 
    }
    setIsSending(true);
    const generatedPassword = generateRandomPassword(10);
  // Length of password: 10
    localStorage.setItem('pass',generatedPassword);
    const serviceId = 'service_6vo282d';
    const templateId = 'template_ehn9iyv';
    const userId = 'Ms2qT4zrq9SKfEDKN';
    ref.current.continuousStart();
    emailjs.send(serviceId, templateId, {
      name:name,
      to_email:inputValue,
      password: generatedPassword,
      date:currentDate,
    }, userId)
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
        // Clear email input and password after sending
        setInputValue('');
        setgenPassword('');
        ref.current.complete();
        setIsSending(false);
     
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        ref.current.complete();
        setIsSending(false);
      });
    setIsDialogOpen(false);
    setInputValue('');
  
  };
  
  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(45, 42, 42, 0.608)',
      zIndex: 2,
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    },
    
    content: {
   
    }
  };
  return (
    <div className="main">
      <Toaster></Toaster>
      <LoadingBar color="white" ref={ref} />
      <Navbar notification={notification} logout={"logout"}></Navbar>
      
      <Modal style={customStyles} isOpen={isDialogOpen1} onRequestClose={handleCloseDialog1} className="formModal" contentLabel="Dialog Box">
        <h1>Verify</h1>
        <div style={{fontSize:"12px"}}><strong>Note: To Get access to upload video solution verify with password</strong></div>
        <input
          type="password"
          value={checkpass}
          onChange={(e)=>setcheckpass(e.target.value)}
          placeholder="Password"
          className="modal-input"
          required
        />
       <div className="nopass" onClick={()=>{ setIsDialogOpen1(false); setIsDialogOpen(true);}}>Don't have password?</div>
        <div className="button-container">
          <button onClick={handleCloseDialog1} className="cancel modbut">Cancel</button>
          <button onClick={handleSubmitDialog1} className="submit modbut">Verify</button>
        </div>
      </Modal>
      <Modal style={customStyles} isOpen={isDialogOpen} onRequestClose={handleCloseDialog} className="formModal" contentLabel="Dialog Box">
        <h1>Are you a Professor?</h1>
        <div style={{fontSize:"12px"}}><strong>Note: To Get access to upload video solution apply with your teacher's id</strong></div>
        <input
          type="text"
          value={name}
          onChange={(e)=>setname(e.target.value)}
          placeholder="Enter your Name"
          className="modal-input"
          required
        />
        <input
          type="email"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your Email id"
          className="modal-input"
          required
        />
         <input
          type="text"
          // value={inputValue}
          // onChange={handleInputChange}
          placeholder="Enter your Teacher id"
          className="modal-input"
          required
        />
        <div className="button-container">
          <button onClick={handleCloseDialog} className="cancel modbut">Cancel</button>
          <button onClick={handleSubmitDialog} className="submit modbut">Submit</button>
        </div>
      </Modal>
      <div className="Profile-page">
        <div className="Profile-header">
          <div className="ProfileIcon1" style={{ position: "relative" }}>
            <label htmlFor="inputImg" className="labelImg">
              <img
                className="image1"
                style={edit ? { filter: "blur(2px)" } : {}}
                src={userImg ? userImg : tempuser.img}
              />
              {edit && (
                <div className="plus" style={{ position: "absolute" }}>
                  +
                </div>
              )}
            </label>
            {edit && (
              <input
                className="inputImg"
                id="inputImg"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </div>
          <div className="Profile-description">
            {!edit && (
              <>
                {" "}
                <div style={{ fontSize: "25px" }}>{tempuser.name} {userJs.occupation=="Teacher"&& <span class="goldBG goldText siz">Professor</span>}</div>
                <div style={{ color: "#f0f8ff57" }}>
                  <i>{tempuser.bio}</i>
                </div>
                <div style={{ fontSize: "18px" }}>{tempuser.occupation}</div>
                <div
                  style={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column-reverse",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Posts{" "}
                    <div style={{ fontSize: "25px" }}>{cards?.length}</div>
                  </div>
                  <button className="Edit-button" onClick={handleedit}>
                    Edit Profile
                  </button>
                </div>
              </>
            )}
             {userJs.occupation!=="Teacher"&&   <div className="Teaching" onClick={handleOpenDialog}>Teaching ?</div>}
            {edit && (
              <>
                 <div className="radio-toolbar">
      <input
        type="radio"
        id="radio2"
        name="radios"
        value="Student"
        checked={occ === 'Student'}
        onChange={handleRadioChange}
      />
      <label htmlFor="radio2">Student</label>
      <input
        type="radio"
        id="radio3"
        name="radios"
        value="Teacher"
        checked={occ === 'Teacher'}
        onChange={handleRadioChange}
      />
      <label htmlFor="radio3" onClick={handleOpenDialog1}>Teacher</label>
    </div>
                <input
                  type="text"
                  className="updateinput"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className="updateinput"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Email"
                />
                <input
                  type="text"
                  className="updateinput"
                  value={bio}
                  onChange={(e) => setbio(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Bio"
                />
                {/* <input type="text" className='updateinput' value={occ} onChange={(e)=>setocc(e.target.value)} style={{width:"100%"}} placeholder='Occupation'/> */}
                <input
                  type="text"
                  className="updateinput"
                  value={passwo}
                  onChange={(e) => setpasswo(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="password"
                />
              

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <button
                    className="Edit-button"
                    style={{ backgroundColor: "red" }}
                  >
                    Delete Profile
                  </button>
                  <button className="Edit-button" onClick={updateUser}>
                    Update Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="post-container-box">
          <div className="Posts-container">
            {cards?.length > 0 &&
              cards?.map((e, index) => (
                <div className="Post1">
                  <div className="Post-header">
                    <div className="ProfileIcon" style={{ cursor: "pointer",position:"relative" }}>
                      <img src={tempuser.img} alt="icon" className="image" />
                      {userJs.occupation=="Teacher"&& <span class="goldBG goldText fix">Professor</span>}
                    </div>
                    <div className="label-container">
                      {cards[index]?.labels?.map((e, i) => (
                        <Chip label={e.value} color="primary" />
                      ))}
                    </div>
                  </div>
                  <div
                    className="Post-question"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/question/${index}`)}
                  >
                    {e.title}
                  </div>
                  {e.postImg !== null && (
                    <div className="colorBox1">
                      <img className="poimage " src={e.postImg} />
                    </div>
                  )}
                  <div className="upvote-downvote">
                    <div className="Vote-reply-container">
                      <div className="vote">
                        <div
                          className="upvote"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleupvote(index)}
                        >
                          <FaArrowUp></FaArrowUp>
                        </div>
                        <div className="vote-count">{cards[index].votes}</div>
                        <div
                          className="downvote"
                          style={{ cursor: "pointer" }}
                          onClick={() => handledownvote(index)}
                        >
                          <FaArrowDown></FaArrowDown>
                        </div>
                      </div>
                      <div className="reply">
                        Reply: {cards[index].replies?.length}
                      </div>
                    </div>
                    <div className="moment-post">
                      {moment(new Date(cards[index].createdAt)).fromNow()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
