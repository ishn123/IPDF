import React, { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import "./style.css"
import { FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import { Toaster,toast } from 'react-hot-toast';
import moment from 'moment';
function Profile() {
    const savednotificationsJSON = localStorage.getItem("notifications");
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const savednotifications = savednotificationsJSON ? JSON.parse(savednotificationsJSON) : [];
    const [notification, setnotification] = useState(savednotifications);
    const savedcardsJSON = localStorage.getItem("cards");
    const handleupvote = (index) => {
        if(cards[index].isDownvoted == 0 && cards[index].isUpvoted == 0){
            setnotification([...notification,{text:"You just voted a question",createdAt:Date.now()}]);
        }
        if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 1) {
            const tempcards = [...cards];
            const newcard = {
                id: cards[index].id,
                title: cards[index].title,
                labels: [...cards[index].labels],
                answer:cards[index].answer,
                replies: [...cards[index].replies],
                votes: cards[index].votes + 1,
                createdAt: cards[index].createdAt,
                isUpvoted: 1,
                isDownvoted: 0
            };
            tempcards[index] = newcard;
            setcards(tempcards);
            return;
        }
        if (cards[index].isDownvoted == 0 && cards[index].isUpvoted == 1){
               return;
        }
        const tempcards = [...cards];
        const newcard = {
            id: cards[index].id,
            title: cards[index].title,
            labels: [...cards[index].labels],
            answer:cards[index].answer,
            replies: [...cards[index].replies],
            votes: cards[index].votes + 1,
            createdAt: cards[index].createdAt,
            isUpvoted: 1,
            isDownvoted: cards[index].isDownvoted
        };
        tempcards[index] = newcard;
        setcards(tempcards);
    };
    const handledownvote = (index) => {
        if(cards[index].isDownvoted == 0 && cards[index].isUpvoted == 0){
            setnotification([...notification,{text:"You just voted a question",createdAt:Date.now()}]);
        }
        if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 1) {
            const tempcards = [...cards];
            const newcard = {
                id: cards[index].id,
                title: cards[index].title,
                labels: [...cards[index].labels],
                answer: cards[index].answer,
                replies: [...cards[index].replies],
                votes: cards[index].votes - 1,
                createdAt: cards[index].createdAt,
                isUpvoted: 0,
                isDownvoted: 1
            };
            tempcards[index] = newcard;
            setcards(tempcards);
            return;
        }
        if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 0){
            return;
     }
        const tempcards = [...cards];
        const newcard = {
            id: cards[index].id,
            title: cards[index].title,
            labels: [...cards[index].labels],
            answer: cards[index].answer,
            replies: [...cards[index].replies],
            votes: cards[index].votes - 1,
            createdAt: cards[index].createdAt,
            isUpvoted: cards[index].isUpvoted,
            isDownvoted: 1
        };
        tempcards[index] = newcard;
        setcards(tempcards);
    };
    const savedcards = savedcardsJSON ? JSON.parse(savedcardsJSON) : [];
    const [cards, setcards] = useState(savedcards);
    const token=localStorage.getItem("user");
    const tempuser=JSON.parse(token);
    const [userImg, setUserImg] = useState("");
    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if(fileReader.readyState === fileReader.DONE) {
                setUserImg(fileReader.result)
                console.log('img data', fileReader.result);
            }
        }
    }
    useEffect(() => {
        localStorage.setItem("cards", JSON.stringify(cards));
    }, [cards]);
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notification));
    }, [notification]);
    const handleedit=()=>{
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
    const [edit,setedit]=useState(false);
    const [Name,setName]=useState("");
    const [Email,setEmail]=useState("");
    const [bio,setbio]=useState("");
    const [occ,setocc]=useState("");
    const [passwo,setpasswo]=useState("");
    const updateUser = async(event)=>{
        event.preventDefault();
        const uid = localStorage.getItem("user");
      

        await fetch(`https://test-back-jeji.onrender.com/updateUser/${JSON.parse(uid).id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({username:Name!=""?Name:JSON.parse(uid).name,email:Email!=""?Email:JSON.parse(uid).email,password:passwo?passwo:JSON.parse(uid).password})
        }).then((res)=>{
            toast.success('User updated successfully',
            {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
            );
        }).catch((err)=>
        toast.success('Server error',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
        )
        )
        const newuser={
            img:userImg ? userImg :"https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg",
            id:JSON.parse(uid).id,
            name:Name!=""?Name:JSON.parse(uid).name,
            email:Email!=""?Email:JSON.parse(uid).email,
            password:passwo?passwo:JSON.parse(uid).password,
            bio:bio?bio:"The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela.",
            occupation:occ?occ:"Student"
          };
          localStorage.setItem("user",JSON.stringify(newuser));
      }
    return (
        <div className='main'>
            <Toaster></Toaster>
            <Navbar notification={notification} logout={"logout"}></Navbar>
            <div className='Profile-page'>
                <div className='Profile-header'>
                    <div className="ProfileIcon1" style={{position:"relative"}}>
                    <label htmlFor="inputImg" className="labelImg">
                            <img className='image1' style={edit?{filter:"blur(2px)"}:{}} src={userImg ? userImg : tempuser.img}/>
                          {edit&& <div className='plus' style={{position:"absolute"}}>+</div>}
                        </label>
                       { edit&& <input
                            className="inputImg"
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />}
                    </div>
                   <div className='Profile-description'>
                   {!edit &&<>   <div style={{ fontSize: "25px" }}>{tempuser.name}</div>
                        <div style={{ color: "#f0f8ff57" }}><i>{tempuser.bio}</i></div>
                        <div style={{ fontSize: "18px" }}>{tempuser.occupation}</div>
                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "center", alignItems: "center" }}>Posts <div style={
                                { fontSize: "25px" }
                            }>{cards?.length}</div></div>
                            <button className='Edit-button' onClick={handleedit}>Edit Profile</button>
                        </div></> }
                        {
                            edit&&<>
                            <input type="text" className='updateinput' value={Name} onChange={(e)=>setName(e.target.value)} style={{width:"100%"}} placeholder='Name'/>
                            <input type="text" className='updateinput' value={Email} onChange={(e)=>setEmail(e.target.value)} style={{width:"100%"}} placeholder='Email'/>
                            <input type="text" className='updateinput' value={bio} onChange={(e)=>setbio(e.target.value)} style={{width:"100%"}} placeholder='Bio'/>
                            <input type="text" className='updateinput' value={occ} onChange={(e)=>setocc(e.target.value)} style={{width:"100%"}} placeholder='Occupation'/>
                            <input type="text" className='updateinput' value={passwo} onChange={(e)=>setpasswo(e.target.value)} style={{width:"100%"}} placeholder='password'/>
                            <div style={{display:"flex",justifyContent:"space-around",width:"100%"}}>
                            <button className='Edit-button' style={{backgroundColor:"red"}} >Delete Profile</button>
                            <button className='Edit-button' onClick={updateUser}>Update Profile</button>
                            </div>
                            </>
                        }
                    </div>
                </div>
                <div className='post-container-box'>
                <div className='Posts-container'>
                    {cards?.length > 0 &&
                        cards?.map((e, index) => (
                            <div className='Post1'>
                                <div className='Post-header'>
                                    <div className="ProfileIcon" style={{ cursor: "pointer" }}><img src={tempuser.img} alt="icon" className='image' />

                                    </div>
                                    <div className='label-container'>
                                        {cards[index]?.labels?.map((e, i) => (
                                            <Chip label={e.value} color="primary" />
                                        ))}
                                    </div>
                                </div>
                                <div className='Post-question' style={{ cursor: "pointer" }} onClick={() => navigate(`/question/${index}`)}>
                                    {e.title}
                                </div>
                                <div className='upvote-downvote'>
                                    <div className='Vote-reply-container'>
                                        <div className='vote'>
                                            <div className='upvote' style={{ cursor: "pointer" }} onClick={() => handleupvote(index)}><FaArrowUp></FaArrowUp></div>
                                            <div className='vote-count'>{cards[index].votes}</div>
                                            <div className='downvote' style={{ cursor: "pointer" }} onClick={() => handledownvote(index)}><FaArrowDown></FaArrowDown></div>
                                        </div>
                                        <div className='reply' >Reply: {cards[index].replies?.length}</div>
                                    </div>
                                    <div className='moment-post'>{moment(new Date(cards[index].createdAt)).fromNow()}</div>
                                </div>
                            </div>)
                        )
                    }

                </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
