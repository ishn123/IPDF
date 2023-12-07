import React, { useState, useEffect } from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import "./style.css"
import { FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
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
    useEffect(() => {
        localStorage.setItem("cards", JSON.stringify(cards));
    }, [cards]);
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notification));
    }, [notification]);
    return (
        <div className='main'>
            <Navbar notification={notification} logout={"logout"}></Navbar>
            <div className='Profile-page'>
                <div className='Profile-header'>
                    <div className="ProfileIcon1"><img src="https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg" alt="icon" className='image1' /></div>
                    <div className='Profile-description'>
                        <div style={{ fontSize: "25px" }}>Sanyam Sharma</div>
                        <div style={{ color: "#f0f8ff57" }}><i>The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela.</i></div>
                        <div style={{ fontSize: "18px" }}>Student</div>
                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "center", alignItems: "center" }}>Posts <div style={
                                { fontSize: "25px" }
                            }>{cards?.length}</div></div>
                            <button className='Edit-button'>Edit Profile</button>
                        </div>
                    </div>
                </div>
                <div className='post-container-box'>
                <div className='Posts-container'>
                    {cards?.length > 0 &&
                        cards?.map((e, index) => (
                            <div className='Post1'>
                                <div className='Post-header'>
                                    <div className="ProfileIcon" style={{ cursor: "pointer" }}><img src="https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg" alt="icon" className='image' />

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
                                    <div>{moment(new Date(cards[index].createdAt)).fromNow()}</div>
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
