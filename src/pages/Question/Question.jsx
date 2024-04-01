import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import Navbar from "../../Components/Navbar/Navbar";
import { FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa";
import Chip from "@mui/material/Chip";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Modal from "react-modal";
import emailjs from "emailjs-com";
import LoadingBar from "react-top-loading-bar";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import axios from "axios";
const formatDate = (date) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};
const generateRandomPassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};
function Question() {
  const urlsearchParams = new URLSearchParams(useLocation().search);
  
  const temp = [40, 10, 54, 56, 38, 90, 100, 89, 23, 4, 5, 6, 7, 8, 9];
  const savedcardsJSON = localStorage.getItem("cards");
  const savednotificationsJSON = localStorage.getItem("notifications");
  const savednotifications = savednotificationsJSON
    ? JSON.parse(savednotificationsJSON)
    : [];
  const userJSON = localStorage.getItem("user");
  const userJs = userJSON ? JSON.parse(userJSON) : [];
  const [notification, setnotification] = useState(savednotifications);
  
  const { id } = useParams();
  const ref = useRef(null);
  const navigate = useNavigate();
  const savedcards = savedcardsJSON ? JSON.parse(savedcardsJSON) : null;
  const [active, setactive] = useState(true);
  const [cards, setcards] = useState(savedcards);
  const [name, setname] = useState("");
  const [summary, setSummary] = useState("");
  const handleupvote = async(index) => {
    if (cards[index].isDownvoted == 0 && cards[index].isUpvoted == 0) {
      setnotification([
        ...notification,
        { text: "You just voted a question", createdAt: Date.now() },
      ]);
    }
    if (cards[index].isDownvoted == 1 && cards[index].isUpvoted == 1) {
      const tempcards = [...cards];
      const newcard = {
        //id: cards[index].id,
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
  const [reply, setreply] = useState("");
  const handleReply = async() => {
    const newreply = {
      text: reply,
      vote: 0,
      createdAt: Date.now(),
      isUpvoted: 0,
      isDownvoted: 0,
    };

    const tempcards = [...cards];
    const newcard = {
      id: cards[id].id,
      title: cards[id].title,
      postImg: cards[id].postImg,
      labels: [...cards[id].labels],
      answer: cards[id].answer,
      replies: [...cards[id].replies, newreply],
      votes: cards[id].votes,
      createdAt: cards[id].createdAt,
    };
    const res = await fetch(`http://localhost:8000/questions/${urlsearchParams.get("qid")}/replies`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({...newreply,user_id:JSON.parse(localStorage.getItem("user")).id})
    })
    .then((res)=>res.json());
    console.log(res); // Reply
   
    tempcards[id] = newcard;
    setcards(tempcards);
    setnotification([
      ...notification,
      { text: "You just replied on a question", createdAt: Date.now() },
    ]);
  };
  const handleReplyUpvote = (i) => {
    if (
      cards[id].replies[i].isDownvoted == 0 &&
      cards[id].replies[i].isUpvoted == 0
    ) {
      setnotification([
        ...notification,
        { text: "You just voted a reply", createdAt: Date.now() },
      ]);
    }
    if (
      cards[id].replies[i].isDownvoted == 1 &&
      cards[id].replies[i].isUpvoted == 1
    ) {
      const tempreplies = [...cards[id].replies];
      const newreply = {
        text: cards[id].replies[i].text,
        vote: cards[id].replies[i].vote + 1,
        createdAt: cards[id].replies[i].createdAt,
        isUpvoted: 1,
        isDownvoted: 0,
      };
      tempreplies[i] = newreply;
      const tempcards = [...cards];
      const newcard = {
        id: cards[id].id,
        title: cards[id].title,
        postImg: cards[id].postImg,
        labels: [...cards[id].labels],
        answer: cards[id].answer,
        replies: [...tempreplies],
        votes: cards[id].votes,
        createdAt: cards[id].createdAt,
        isUpvoted: cards[id].isUpvoted,
        isDownvoted: cards[id].isDownvoted,
      };
      tempcards[id] = newcard;
      setcards(tempcards);
      return;
    }
    if (
      cards[id].replies[i].isDownvoted == 0 &&
      cards[id].replies[i].isUpvoted == 1
    ) {
      return;
    }
    const tempreplies = [...cards[id].replies];
    const newreply = {
      text: cards[id].replies[i].text,
      vote: cards[id].replies[i].vote + 1,
      createdAt: cards[id].replies[i].createdAt,
      isUpvoted: 1,
      isDownvoted: cards[id].replies[i].isDownvoted,
    };
    tempreplies[i] = newreply;
    const tempcards = [...cards];
    const newcard = {
      id: cards[id].id,
      title: cards[id].title,
      postImg: cards[id].postImg,
      labels: [...cards[id].labels],
      answer: cards[id].answer,
      replies: [...tempreplies],
      votes: cards[id].votes,
      createdAt: cards[id].createdAt,
      isUpvoted: cards[id].isUpvoted,
      isDownvoted: cards[id].isDownvoted,
    };
    tempcards[id] = newcard;
    setcards(tempcards);
  };
  const handleReplyDownvote = (i) => {
    if (
      cards[id].replies[i].isDownvoted == 0 &&
      cards[id].replies[i].isUpvoted == 0
    ) {
      setnotification([
        ...notification,
        { text: "You just voted a reply", createdAt: Date.now() },
      ]);
    }
    if (
      cards[id].replies[i].isDownvoted == 1 &&
      cards[id].replies[i].isUpvoted == 1
    ) {
      const tempreplies = [...cards[id].replies];
      const newreply = {
        text: cards[id].replies[i].text,
        vote: cards[id].replies[i].vote - 1,
        createdAt: cards[id].replies[i].createdAt,
        isUpvoted: 0,
        isDownvoted: 1,
      };
      tempreplies[i] = newreply;
      const tempcards = [...cards];
      const newcard = {
        id: cards[id].id,
        title: cards[id].title,
        postImg: cards[id].postImg,
        labels: [...cards[id].labels],
        answer: cards[id].answer,
        replies: [...tempreplies],
        votes: cards[id].votes,
        createdAt: cards[id].createdAt,
        isUpvoted: cards[id].isUpvoted,
        isDownvoted: cards[id].isDownvoted,
      };
      tempcards[id] = newcard;
      setcards(tempcards);
      return;
    }
    if (
      cards[id].replies[i].isDownvoted == 1 &&
      cards[id].replies[i].isUpvoted == 0
    ) {
      return;
    }
    const tempreplies = [...cards[id].replies];
    const newreply = {
      text: cards[id].replies[i].text,
      vote: cards[id].replies[i].vote - 1,
      createdAt: cards[id].replies[i].createdAt,
      isUpvoted: cards[id].replies[i].isUpvoted,
      isDownvoted: 1,
    };
    tempreplies[i] = newreply;
    const tempcards = [...cards];
    const newcard = {
      id: cards[id].id,
      title: cards[id].title,
      postImg: cards[id].postImg,
      labels: [...cards[id].labels],
      answer: cards[id].answer,
      replies: [...tempreplies],
      votes: cards[id].votes,
      createdAt: cards[id].createdAt,
      isUpvoted: cards[id].isUpvoted,
      isDownvoted: cards[id].isDownvoted,
    };
    tempcards[id] = newcard;
    setcards(tempcards);
  };
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  const [isSending, setIsSending] = useState(false);
  const token = localStorage.getItem("user");
  const tempuser = JSON.parse(token);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notification));
  }, [notification]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const [genpassword, setgenPassword] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const currentDateFormatted = formatDate(new Date());
    setCurrentDate(currentDateFormatted);
  }, []);
  const handleSubmitDialog = () => {
    setIsSending(true);
    const generatedPassword = generateRandomPassword(10);
    // Length of password: 10
    localStorage.setItem("pass", generatedPassword);
    const serviceId = "service_6vo282d";
    const templateId = "template_ehn9iyv";
    const userId = "Ms2qT4zrq9SKfEDKN";

    emailjs
      .send(
        serviceId,
        templateId,
        {
          name: name,
          to_email: inputValue,
          password: generatedPassword,
          date: currentDate,
        },
        userId
      )
      .then((response) => {
        console.log("Email sent successfully:", response.status, response.text);
        // Clear email input and password after sending
        setInputValue("");
        setgenPassword("");
        ref.current.complete();
        setIsSending(false);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        ref.current.complete();
        setIsSending(false);
      });
    setIsDialogOpen(false);
    setInputValue("");
  };

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(45, 42, 42, 0.608)",
      zIndex: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    content: {},
  };
  const summarizeText = async () => {
    ref.current.continuousStart();

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          inputs: cards[id].title,
          parameters: {
            max_length: 100,
            min_length: 0,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + "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",
          },
        }
      );
        
      ref.current.complete();
      
      setSummary(response.data[0].summary_text);
    } catch (error) {
      console.error("Error summarizing text:", error);
      alert("An error occurred while summarizing the text.");
    }
  };

  return (
    <div className="main">
      <Navbar notification={notification}></Navbar>
      {/* <div className='Menu-item'></div> */}
      <LoadingBar color="white" ref={ref} />
      <Modal
        style={customStyles}
        isOpen={isDialogOpen}
        onRequestClose={handleCloseDialog}
        className="formModal"
        contentLabel="Dialog Box"
      >
        <h1>Are you a Professor?</h1>
        <div style={{ fontSize: "12px" }}>
          <strong>
            Note: To Get access to upload video solution apply with your
            teacher's id
          </strong>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Enter your Name"
          className="modal-input"
        />
        <input
          type="email"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your Email id"
          className="modal-input"
        />
        <input
          type="text"
          // value={inputValue}
          // onChange={handleInputChange}
          placeholder="Enter your Teacher id"
          className="modal-input"
        />
        <div className="button-container">
          <button onClick={handleCloseDialog} className="cancel modbut">
            Cancel
          </button>
          <button onClick={handleSubmitDialog} className="submit modbut">
            Submit
          </button>
        </div>
      </Modal>
      <div className="Home">
        <div className="Questions-container">
          <div className="Post">
            <div className="Post-header">
              <div
                className="ProfileIcon"
                style={{ cursor: "pointer", position: "relative" }}
              >
                <img src={tempuser.img} alt="icon" className="image" />
                {userJs.occupation == "Teacher" && (
                  <span class="goldBG goldText fix">Professor</span>
                )}
              </div>
              <div className="label-container">
                {cards[id]?.labels?.map((e, i) => (
                  <Chip label={e.value} color="primary" />
                ))}
              </div>
            </div>
            {userJs.occupation !== "Teacher" && (
              <div className="Teaching" onClick={handleOpenDialog}>
                Teaching ?
              </div>
            )}
            <div className="Post-question">{cards[id].title}</div>
            {cards[id].postImg !== null && (
              <div className="colorBox1">
                <img className="poimage " src={cards[id].postImg} />
              </div>
            )}
            {cards[id].answer != "" && (
              <div className="Genrative-AI">
                <div
                  className="Answer-box"
                  style={
                    active
                      ? { height: "100px", overflow: "hidden" }
                      : { overflowX: "scroll" }
                  }
                >
                  <span style={{ fontSize: "20px" }}>Answer</span>
                  <pre> {cards[id].answer}</pre>
                </div>
                <div
                  className="See-more"
                  style={active ? {} : { display: "none" }}
                  onClick={() => setactive(!active)}
                >
                  See More...
                </div>
                <div
                  className="See-less"
                  style={!active ? {} : { display: "none" }}
                  onClick={() => setactive(!active)}
                >
                  See Less...
                </div>
              </div>
            )}
            <div className="upvote-downvote">
              <div className="Vote-reply-container">
                <div className="vote">
                  <div
                    className="upvote"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleupvote(id)}
                  >
                    <FaArrowUp></FaArrowUp>
                  </div>
                  <div className="vote-count">{cards[id].votes}</div>
                  <div
                    className="downvote"
                    style={{ cursor: "pointer" }}
                    onClick={() => handledownvote(id)}
                  >
                    <FaArrowDown></FaArrowDown>
                  </div>
                </div>
                <div className="reply">Reply: {cards[id].replies?.length}</div>
              </div>
              <div className="moment-post">
                {moment(new Date(cards[id].createdAt)).fromNow()}
              </div>
            </div>
          </div>
          {userJs.occupation == "Teacher" && (
            <div className="summary-box">
                {summary&&<>{summary}</>}
              {!summary &&<div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#6e6e6e" }}>
                  Summarize your Question
                </span>
                <div
                  className="tfbut"
                  style={{
                    color: "white",
                    fontSize: "25px",
                    cursor: "pointer",
                    backgroundColor: "rgb(58 58 58)",
                  }}
                  onClick={summarizeText}
                >
                  <TfiWrite />
                </div>
              </div> }
            </div>
          )}
          <div className="Reply-box">
            <input
              type="text"
              value={reply}
              onChange={(e) => {
                setreply(e.target.value);
              }}
              className="Reply-input"
              placeholder={"Write answer for this question"}
            /><div className="replb">
               {userJs.occupation=="Teacher"&&  <label className="addImg" >
                <input
                  // className="inputImg"
                  // id="inputImg"
                  type="file"
                  //    style={{visibility:"hidden"}}
                  accept="image/*"
                  hidden
                //   onChange={(e) => {
                //     handleImageChange(e);
                //   }}
                />
             <MdOutlineVideoLibrary />
              </label>}
            <button className="Send-reply" onClick={handleReply}>
              Reply
              <FaPaperPlane></FaPaperPlane>
            </button></div>
          </div>

          <div className="Replies-container">
            <h1 style={{ color: "aliceblue" }}>Replies</h1>
            <div className="Replies-box">
              {cards[id].replies?.length == 0 && (
                <div className="No-replies">No Replies</div>
              )}
              {cards[id].replies?.map((e, i) => (
                <div className="Replies-box-content">
                  <div className="Post-header">
                    <div
                      className="ProfileIcon"
                      style={{ cursor: "pointer", position: "relative" }}
                    >
                      <img src={tempuser.img} alt="icon" className="image" />
                      {userJs.occupation == "Teacher" && (
                        <span class="goldBG goldText fix">Professor</span>
                      )}
                    </div>
                    <div style={{ color: "rgba(240, 248, 255, 0.708)" }}>
                      {moment(new Date(e.createdAt)).fromNow()}
                    </div>
                  </div>
                  <div
                    className="Replies-content"
                    style={{ color: "aliceblue" }}
                  >
                    {e.text}
                  </div>
                  <div className="upvote-downvote">
                    <div className="vote">
                      <div
                        className="upvote"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleReplyUpvote(i)}
                      >
                        <FaArrowUp></FaArrowUp>
                      </div>
                      <div className="vote-count">{e.vote}</div>
                      <div
                        className="downvote"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleReplyDownvote(i)}
                      >
                        <FaArrowDown></FaArrowDown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="MyQuestionContainer">
        <div className="MyQuestions">
          <div className="MyQuestions-header">My Questions</div>
          <div className="MyQuestions-content">
            <div className="MyQuestions-content-container">
              {cards.map((e, i) => {
                return (
                  <>
                    <div
                      className="MyQuestions-content-box"
                      onClick={() => navigate(`/question/${i}`)}
                    >
                      <div className="MyQuestions-content-title">
                        <span>{e.title}</span>?
                      </div>
                      <div className="MyQuestions-content-votes-container">
                        <div className="MyQuestions-content-votes">
                          Votes:{e.votes} Replies:{e.replies?.length}
                        </div>
                        <div>
                          {moment(new Date(cards[i].createdAt)).fromNow()}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
