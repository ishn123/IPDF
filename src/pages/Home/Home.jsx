import React, { useEffect, useState } from 'react'
import "./style.css"
import Navbar from '../../Components/Navbar/Navbar'
import { FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function Home() {
    const navigate = useNavigate();
    const animatedComponents = makeAnimated();
    const [question, setquestion] = useState("");
    const [genrate, setgenrate] = useState(true);
    const savednotificationsJSON = localStorage.getItem("notifications");
    const savednotifications = savednotificationsJSON ? JSON.parse(savednotificationsJSON) : [];
    const [notification, setnotification] = useState(savednotifications);
    const savedcardsJSON = localStorage.getItem("cards");
  
    const savedcards = savedcardsJSON ? JSON.parse(savedcardsJSON) : [];
    const [cards, setcards] = useState(savedcards);
    const [Ans, setAns] = useState("Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium nisi totam maxime soluta, quod rem sequi, voluptate nam nihil ex molestias debitis! Dicta sequi maiores eveniet, nisi amet ad, commodi voluptas alias, ipsa quasi laudantium optio. Sequi ducimus cumque dignissimos. Vitae ipsam consequuntur molestias itaque? Maiores quibusdam doloribus officia dolorem, cumque alias illum. Fugiat ut hic, nam nemo molestiae provident similique nisi facilis unde culpa nostrum tenetur laboriosam fuga itaque sequi quis a quaerat repellat aspernatur, ipsa placeat minus! Placeat sunt ad, odio quod praesentium quas aliquam dolore excepturi quasi fuga, alias dignissimos repellat maxime? Repellat, consequatur? Dignissimos nemo quidem odio blanditiis excepturi quas laboriosam error amet pariatur dicta sapiente debitis ipsam architecto eveniet, aliquam quo. Nostrum vel beatae voluptatibus.")
    const [active, setactive] = useState(true);
    const handlepost = () => {
        if (question.trim() === "") {
            alert("question required!!!!");
            return;
        }
        // if (!genrate) {
        //     setAns("Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium nisi totam maxime soluta, quod rem sequi, voluptate nam nihil ex molestias debitis! Dicta sequi maiores eveniet, nisi amet ad, commodi voluptas alias, ipsa quasi laudantium optio. Sequi ducimus cumque dignissimos. Vitae ipsam consequuntur molestias itaque? Maiores quibusdam doloribus officia dolorem, cumque alias illum. Fugiat ut hic, nam nemo molestiae provident similique nisi facilis unde culpa nostrum tenetur laboriosam fuga itaque sequi quis a quaerat repellat aspernatur, ipsa placeat minus! Placeat sunt ad, odio quod praesentium quas aliquam dolore excepturi quasi fuga, alias dignissimos repellat maxime? Repellat, consequatur? Dignissimos nemo quidem odio blanditiis excepturi quas laboriosam error amet pariatur dicta sapiente debitis ipsam architecto eveniet, aliquam quo. Nostrum vel beatae voluptatibus.")
        // }
        // else {
        //     setAns("");
        // }
        
        const newpost = {
            id: Date.now() + Math.random() * 2,
            title: question,
            labels: [...selectedOptions],
            answer: Ans,
            replies: [],
            votes: 0,
            createdAt: Date.now(),
            isUpvoted: 0,
            isDownvoted: 0
        }
        let temp = [];
        if (cards != null) {
            temp = [...cards];
        }
        temp.push(newpost);
        setcards(temp);
        setquestion("");
        setgenrate(true);
        setnotification([...notification,{text:"You just posted a question",createdAt:Date.now()}]);
    }

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
                answer: Ans,
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
            answer: Ans,
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
                answer: Ans,
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
            answer: Ans,
            replies: [...cards[index].replies],
            votes: cards[index].votes - 1,
            createdAt: cards[index].createdAt,
            isUpvoted: cards[index].isUpvoted,
            isDownvoted: 1
        };
        tempcards[index] = newcard;
        setcards(tempcards);
    };
    const options = [
        { value: 'Maths', label: 'Maths' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'English', label: 'English' }
    ]
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (options) => {
        setSelectedOptions(options);
    };
    const colourStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            // const color = chroma(data.color);
            console.log({ data, isDisabled, isFocused, isSelected });
            return {
                ...styles,
                backgroundColor: isFocused ? "#2d2d30" : null,
                color: "white",
            };
        }
    };
    
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
                    <div className='AskQuestions'>
                        <div className='AskQuestions-header'>Ask a Question</div>
                        <input type="text" className='Input-text' value={question} placeholder='Write a question' onChange={(e) => setquestion(e.target.value)} />
                        <div>
                            <Select
                                closeMenuOnSelect={false}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 4,
                                    colors: {
                                        ...theme.colors,
                                        primary: '#3e3e42',
                                        neutral0: '#3e3e42',
                                        neutral80: "white",
                                        neutral90: "white",
                                        neutral10: "#2d2d30"
                                    },
                                })}
                                styles={colourStyles}
                                components={animatedComponents}
                                isMulti
                                options={options}
                                placeholder="Add Labels"
                                onChange={handleChange}
                            />
                        </div>

                        <div className='Genrative-AI'>
                            {genrate && (<> <div className='Genrative-content'>Get genrative AI Solution for your problem</div>
                                <button className="Genrative-button" onClick={() => setgenrate(!genrate)}>Generate</button>
                            </>
                            )}
                            {!genrate && (
                                <>
                                    <div className='Answer-box' style={active ? { height: "100px" } : {}}>
                                        <span style={{ fontSize: "20px" }}>Answer</span>
                                        {Ans}
                                    </div>
                                    <div className='See-more' style={active ? {} : { display: "none" }} onClick={() => setactive(!active)}>See More...</div>
                                </>
                            )

                            }
                        </div>
                        <button className="Create-post" onClick={handlepost} >
                            POST
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
                <div className='Posts-container'>
                    {cards?.length > 0 &&
                        cards?.map((e, index) => (
                            <div className='Post'>
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
                                    <div className='moment-post'>{moment(new Date(cards[index].createdAt)).fromNow()}</div>
                                </div>
                            </div>)
                        )
                    }

                </div>

            </div>
            <div className='MyQuestionContainer'>
                <div className='MyQuestions'>
                    <div className='MyQuestions-header'>My Questions</div>
                    <div className='MyQuestions-content'>
                        <div className='MyQuestions-content-container'>
                            {
                                cards.length == 0 && (
                                    <div className="No-questions">
                                        No Questions Asked
                                    </div>
                                )
                            }
                            {cards?.map((e, i) => {
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

export default Home
