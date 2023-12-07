import React, { useEffect, useState } from 'react'
import "./style.css"
import Navbar from '../../Components/Navbar/Navbar'
import { FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa"
import Chip from '@mui/material/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function Question() {
    
    const temp = [40, 10, 54, 56, 38, 90, 100, 89, 23, 4, 5, 6, 7, 8, 9];
    const savedcardsJSON = localStorage.getItem("cards");
    const savednotificationsJSON = localStorage.getItem("notifications");
    const savednotifications = savednotificationsJSON ? JSON.parse(savednotificationsJSON) : [];
    const [notification, setnotification] = useState(savednotifications);
    const { id } = useParams();
    const navigate = useNavigate();
    const savedcards = savedcardsJSON ? JSON.parse(savedcardsJSON) : null;
    const [active, setactive] = useState(true);
    const [cards, setcards] = useState(savedcards);
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
                answer: cards[index].answer,
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
            answer: cards[index].answer,
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
    const [reply, setreply] = useState("");
    const handleReply = () => {
        const newreply = {
            text: reply,
            vote: 0,
            createdAt: Date.now(),
            isUpvoted:0,
            isDownvoted:0
        };
        const tempcards = [...cards];
        const newcard = {
            id: cards[id].id,
            title: cards[id].title,
            labels: [...cards[id].labels],
            answer: cards[id].answer,
            replies: [...cards[id].replies, newreply],
            votes: cards[id].votes,
            createdAt: cards[id].createdAt,
        };
        tempcards[id] = newcard;
        setcards(tempcards);
        setnotification([...notification,{text:"You just replied on a question",createdAt:Date.now()}]);
    }
    const handleReplyUpvote=(i)=>{
        if(cards[id].replies[i].isDownvoted == 0 && cards[id].replies[i].isUpvoted == 0){
            setnotification([...notification,{text:"You just voted a reply",createdAt:Date.now()}]);
        }
        if (cards[id].replies[i].isDownvoted == 1 && cards[id].replies[i].isUpvoted == 1) {
            const tempreplies=[...cards[id].replies];
            const newreply = {
                text:cards[id].replies[i].text,
                vote: cards[id].replies[i].vote+1,
                createdAt:cards[id].replies[i].createdAt,
                isUpvoted:1,
                isDownvoted:0
            };
            tempreplies[i]=newreply;
            const tempcards = [...cards];
            const newcard = {
                id: cards[id].id,
                title: cards[id].title,
                labels: [...cards[id].labels],
                answer: cards[id].answer,
                replies: [...tempreplies],
                votes: cards[id].votes,
                createdAt: cards[id].createdAt,
                isUpvoted: cards[id].isUpvoted,
                isDownvoted: cards[id].isDownvoted
            };
            tempcards[id] = newcard;
            setcards(tempcards);
            return;
        }
        if (cards[id].replies[i].isDownvoted == 0 && cards[id].replies[i].isUpvoted == 1){
            return;
     }
        const tempreplies=[...cards[id].replies];
        const newreply = {
            text:cards[id].replies[i].text,
            vote: cards[id].replies[i].vote+1,
            createdAt:cards[id].replies[i].createdAt,
            isUpvoted:1,
            isDownvoted:cards[id].replies[i].isDownvoted,
        };
        tempreplies[i]=newreply;
        const tempcards = [...cards];
        const newcard = {
            id: cards[id].id,
            title: cards[id].title,
            labels: [...cards[id].labels],
            answer: cards[id].answer,
            replies: [...tempreplies],
            votes: cards[id].votes,
            createdAt: cards[id].createdAt,
            isUpvoted: cards[id].isUpvoted,
            isDownvoted: cards[id].isDownvoted
        };
        tempcards[id] = newcard;
        setcards(tempcards);
    }
    const handleReplyDownvote=(i)=>{
        if(cards[id].replies[i].isDownvoted == 0 && cards[id].replies[i].isUpvoted == 0){
            setnotification([...notification,{text:"You just voted a reply",createdAt:Date.now()}]);
        }
        if (cards[id].replies[i].isDownvoted == 1 && cards[id].replies[i].isUpvoted == 1) {
            const tempreplies=[...cards[id].replies];
            const newreply = {
                text:cards[id].replies[i].text,
                vote: cards[id].replies[i].vote-1,
                createdAt:cards[id].replies[i].createdAt,
                isUpvoted:0,
                isDownvoted:1
            };
            tempreplies[i]=newreply;
            const tempcards = [...cards];
            const newcard = {
                id: cards[id].id,
                title: cards[id].title,
                labels: [...cards[id].labels],
                answer: cards[id].answer,
                replies: [...tempreplies],
                votes: cards[id].votes,
                createdAt: cards[id].createdAt,
                isUpvoted: cards[id].isUpvoted,
                isDownvoted: cards[id].isDownvoted
            };
            tempcards[id] = newcard;
            setcards(tempcards);
            return;
        }
        if (cards[id].replies[i].isDownvoted == 1 && cards[id].replies[i].isUpvoted == 0){
            return;
     }
        const tempreplies=[...cards[id].replies];
        const newreply = {
            text:cards[id].replies[i].text,
            vote: cards[id].replies[i].vote-1,
            createdAt:cards[id].replies[i].createdAt,
            isUpvoted:cards[id].replies[i].isUpvoted,
            isDownvoted:1,
        };
        tempreplies[i]=newreply;
        const tempcards = [...cards];
        const newcard = {
            id: cards[id].id,
            title: cards[id].title,
            labels: [...cards[id].labels],
            answer: cards[id].answer,
            replies: [...tempreplies],
            votes: cards[id].votes,
            createdAt: cards[id].createdAt,
            isUpvoted: cards[id].isUpvoted,
            isDownvoted: cards[id].isDownvoted
        };
        tempcards[id] = newcard;
        setcards(tempcards);
    }
    useEffect(() => {
        localStorage.setItem("cards", JSON.stringify(cards));
    }, [cards]);
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notification));
    }, [notification]);
    return (
        <div className='main'>
            <Navbar notification={notification}></Navbar>
            {/* <div className='Menu-item'></div> */}
            <div className='Home'>
                <div className='Questions-container'>
                    <div className='Post'>
                        <div className='Post-header'>
                            <div className="ProfileIcon" style={{ cursor: "pointer" }}><img src="https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg" alt="icon" className='image' />

                            </div>
                            <div className='label-container'>
                                {cards[id]?.labels?.map((e, i) => (
                                    <Chip label={e.value} color="primary" />
                                ))}
                            </div>
                        </div>
                        <div className='Post-question'>
                            {cards[id].title}
                        </div>

                        <div className='Genrative-AI'>
                            <div className='Answer-box' style={active ? { height: "100px" } : {}}>
                                <span style={{ fontSize: "20px" }}>Answer</span>
                                {cards[id].answer}
                            </div>
                            <div className='See-more' style={active ? {} : { display: "none" }} onClick={() => setactive(!active)}>See More...</div>
                            <div className='See-more' style={!active ? {} : { display: "none" }} onClick={() => setactive(!active)}>See Less...</div>
                        </div>
                        <div className='upvote-downvote'>
                            <div className='Vote-reply-container'>
                                <div className='vote'>
                                    <div className='upvote' style={{ cursor: "pointer" }} onClick={() => handleupvote(id)}><FaArrowUp></FaArrowUp></div>
                                    <div className='vote-count'>{cards[id].votes}</div>
                                    <div className='downvote' style={{ cursor: "pointer" }} onClick={() => handledownvote(id)}><FaArrowDown></FaArrowDown></div>
                                </div>
                                <div className='reply' >Reply: {cards[id].replies?.length}</div>
                            </div>
                            <div>{moment(new Date(cards[id].createdAt)).fromNow()}</div>
                        </div>
                    </div>
                    <div className='Reply-box'>
                        <input type="text" value={reply} onChange={(e) => {
                            setreply(e.target.value);
                        }} className='Reply-input' placeholder={"Write answer for this question"} />
                        <button className="Send-reply" onClick={handleReply}>Reply
                            <FaPaperPlane></FaPaperPlane>
                        </button>
                    </div>
                    <div className="Replies-container">
                        <h1 style={{color:"aliceblue"}}>Replies</h1>
                        <div className="Replies-box">
                        {cards[id].replies?.length==0&&<div className="No-replies">No Replies</div>}
                            {
                                cards[id].replies?.map((e, i) => (

                                    <div className='Replies-box-content'>
                                        
                                        <div className='Post-header'>
                                            <div className="ProfileIcon" style={{ cursor: "pointer" }}><img src="https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg" alt="icon" className='image' />

                                            </div>
                                            <div style={{ color: "rgba(240, 248, 255, 0.708)" }}>
                                                {moment(new Date(e.createdAt)).fromNow()}
                                            </div>
                                        </div>
                                        <div className="Replies-content" style={{ color: "aliceblue" }}>{e.text}</div>
                                        <div className='upvote-downvote'>
                                            <div className='vote'>
                                                <div className='upvote' style={{ cursor: "pointer" }} onClick={()=>handleReplyUpvote(i)}><FaArrowUp></FaArrowUp></div>
                                                <div className='vote-count'>{e.vote}</div>
                                                <div className='downvote' style={{ cursor: "pointer" }} onClick={()=>handleReplyDownvote(i)}><FaArrowDown></FaArrowDown></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>

            </div>
            <div className='MyQuestionContainer'>
                <div className='MyQuestions'>
                    <div className='MyQuestions-header'>My Questions</div>
                    <div className='MyQuestions-content'>
                        <div className='MyQuestions-content-container'>
                          
                            {cards.map((e, i) => {
                                return <>
                                    <div className='MyQuestions-content-box' onClick={() => navigate(`/question/${i}`)}>
                                        <div className='MyQuestions-content-title'><span>{e.title}</span>?</div>
                                        <div className='MyQuestions-content-votes-container'>
                                            <div className='MyQuestions-content-votes'>Votes:{e.votes} Replies:{e.replies?.length}</div>
                                            <div>{moment(new Date(cards[i].createdAt)).fromNow()}</div>
                                        </div>

                                    </div></>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Question
