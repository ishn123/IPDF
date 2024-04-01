import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Navbar from "../../Components/Navbar/Navbar";
import {
  FaArrowUp,
  FaArrowDown,
  FaPaperPlane,
  FaMicrophone,
  FaSearch,
} from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import OpenAI from "openai";
import LoadingBar from "react-top-loading-bar";
import { FaImage } from "react-icons/fa6";
import { VscRefresh } from "react-icons/vsc";
import Tesseract from "tesseract.js";
import { Toaster, toast } from "react-hot-toast";
import Modal from "react-modal";
import emailjs from "emailjs-com";
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
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true,
});

function Home() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const urlsearchParams = new URLSearchParams();
  const [searchact, setsearchact] = useState(false);
  const animatedComponents = makeAnimated();
  const [question, setquestion] = useState("");
  const [imgac, setimac] = useState(false);
  const [name, setname] = useState("");
  const [genrate, setgenrate] = useState(true);
  const savednotificationsJSON = localStorage.getItem("notifications");
  const savednotifications = savednotificationsJSON
    ? JSON.parse(savednotificationsJSON)
    : [];
    const userJSON = localStorage.getItem("user");
    const userJs = userJSON
      ? JSON.parse(userJSON)
      : [];
    
  const [notification, setnotification] = useState(savednotifications);
  const [postImg, setPostImg] = useState(null);
  const [pso, setpso] = useState(null);
  const [is, setis] = useState(true);
  const handlestat = () => {
    if (is) {
      setPostImg(pso);
    }
  };
  async function handleImageChange(e) {
    // const file = e.target.files[0];
    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(file);
    // fileReader.onload = () => {
    //     if(fileReader.readyState === fileReader.DONE) {
    //         setPostImg(fileReader.result)
    //         console.log('img data', fileReader.result);
    //     }
    // }
    setis(false);
    e.preventDefault();

    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "lvib9r3j"); // Use your upload preset name here
    formData.append("cloud_name", "dzmf1giby"); // Replace 'your_cloud_name' with your Cloudinary cloud name

    ref.current.continuousStart();
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dzmf1giby/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setPostImg(data.secure_url); // Set the image URL to state
      ref.current.complete();
    } catch (error) {
      console.error("Error uploading image: ", error);
      ref.current.complete();
    }
  }
  const savedcardsJSON = localStorage.getItem("cards");
  const savedcards = savedcardsJSON ? JSON.parse(savedcardsJSON) : [];
  const [cards, setcards] = useState(savedcards);
  const [Ans, setAns] = useState("");
  const [mapans, setmapans] = useState([]);
  const [active, setactive] = useState(true);
  const handlepost = async() => {
    if (question.trim() === "") {
      toast.error("Question cannot be empty", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const newpost = {
      //_id: Date.now() + Math.random() * 2,
      title: question,
      postImg: postImg,
      labels: [...selectedOptions],
      answer: Ans,
      replies: [],
      votes: 0,
      isUpvoted: 0,
      isDownvoted: 0,
      user_id:JSON.parse(localStorage.getItem("user")).id,
      createdAt:Date.now()
    };
    const question_id = await fetch('http://localhost:8000/questions',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(newpost)
    }).then((res)=>res.json());
    console.log(question_id);
    newpost["_id"] = question_id?.question_id; 
    //localStorage.setItem("QID",question_id?.question_id); // Setting the question id in local storage
    console.log(newpost);
    let temp = [];
    if (cards != null) {
      temp = [...cards];
    }
    temp.push(newpost);
    setcards(temp);
    setquestion("");
    setgenrate(true);
    setAns("");
    setnotification([
      ...notification,
      { text: "You just posted a question", createdAt: Date.now() },
    ]);
    setpso(postImg);
    setPostImg(null);
    setis(true);
    setSelectedOptions([]);
  };
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
  const options = [
    { value: "Maths", label: "Maths" },
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
  ];
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
    },
  };

  const handlegenrate = async () => {
    if (question.trim() === "") {
      toast.error("Question cannot be empty", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    ref.current.continuousStart();
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: question }],
        model: "gpt-3.5-turbo",
      });
      if (completion.choices[0].message.content != null) {
        ref.current.complete();
      }
      setAns(completion.choices[0].message.content);
      setgenrate(!genrate);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handlerefresh = async () => {
    try {
      const temp = question + Ans + "genrate another response";
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: temp }],
        model: "gpt-3.5-turbo",
      });
      if (completion.choices[0].message.content != null) {
        ref.current.complete();
      }
      setAns(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const [extractedText, setExtractedText] = useState("");
  const newques = async (text) => {
    try {
      const temp = text + "remove typo  ";
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: temp }],
        model: "gpt-3.5-turbo",
      });
      if (completion.choices[0].message.content != null) {
        ref.current.complete();
      }
      setquestion(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const extractTextFromImage = async () => {
    if (postImg !== null) {
      Tesseract.recognize(
        postImg,
        "eng", // language code
        { logger: (m) => console.log(m) } // optional logger
      ).then(({ data: { text } }) => {
        setExtractedText(text);
        newques(text);
        console.log(text);
      });
    }
  };
  const [isListening, setIsListening] = useState(false);
  //   useEffect(()=>{
  //     const codeRegex = /```([\s\S]*?)```/g;
  //     const codeSnippets = [];
  //     let match;
  //     while ((match = codeRegex.exec(Ans)) !== null) {
  //       const codeSnippet = match[1];
  //       codeSnippets.push(codeSnippet);
  //     }
  //     const textContent = Ans.replace(codeRegex, '&&8&&');
  //     const textcont=textContent.split("&&8&&");
  //     settext
  //     console.log('Code Snippets:', codeSnippets);
  //     console.log('Text Content:', textcont);
  //   },[Ans]);
  useEffect(() => {
    let recognition;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const startListening = () => {
        recognition = new SpeechRecognition(); // for Webkit-based browsers
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setquestion(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error(event.error);
          setIsListening(false);
        };

        recognition.start();
      };

      const stopListening = () => {
        recognition.stop();
        setIsListening(false);
      };

      if (isListening) {
        startListening();
      }
    }
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);
  const token = localStorage.getItem("user");
  const tempuser = JSON.parse(token);
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notification));
  }, [notification]);
  useEffect(() => {
    if (searchact)
      setTimeout(() => {
        setsearchact(false);
      }, 1000);
  }, [searchact]);
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
  const [isSending, setIsSending] = useState(false);
  const handleSubmitDialog = () => {
    setIsSending(true);
    const generatedPassword = generateRandomPassword(10);
    // Length of password: 10
    localStorage.setItem("pass", generatedPassword);
    ref.current.continuousStart();
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
  // const [toEmail, setToEmail] = useState('');

  // const handleSendEmail = () => {

  // };
  return (
    <div className="main">
      <Toaster></Toaster>
      <Navbar notification={notification}></Navbar>
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
      {/* <div className='Menu-item'></div> */}
      <div className="Home">
        <div className="Questions-container">
          <div className="AskQuestions">
            <div className="AskQuestions-header">Ask a Question</div>
            <div
              style={{
                display: "flex",
                /* justify-content: space-between; */
                width: "100%",
                gap: "10px",
              }}
            >
              {" "}
              <input
                type="text"
                className="Input-text"
                value={question}
                placeholder="Write a question"
                onChange={(e) => setquestion(e.target.value)}
              />{" "}
              <div
                className="icon-container"
                onClick={() => {
                  setIsListening(!isListening);
                }}
              >
                {" "}
                {!isListening ? (
                  <div className="Microphone">
                    <FaMicrophone color="white" />
                  </div>
                ) : (
                  <>
                    <div class="bar-c">
                      <div id="bar-1" class="bar"></div>
                      <div id="bar-2" class="bar"></div>
                      <div id="bar-3" class="bar"></div>
                      <div id="bar-4" class="bar"></div>
                      <div id="bar-5" class="bar"></div>
                      <div id="bar-6" class="bar"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <Select
                closeMenuOnSelect={false}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 4,
                  colors: {
                    ...theme.colors,
                    primary: "#3e3e42",
                    neutral0: "#3e3e42",
                    neutral80: "white",
                    neutral90: "white",
                    neutral10: "#2d2d30",
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
            {postImg !== null && (
              <div className="colorBox">
                <img className="poimage " src={postImg} />
                {searchact && <div className="sc animate"></div>}
                <div
                  className="searchbutton"
                  onClick={() => {
                    setsearchact(true);
                    extractTextFromImage();
                  }}
                >
                  <FaSearch />
                </div>
              </div>
            )}
            <div className="Genrative-AI">
              {genrate && (
                <>
                  {" "}
                  <div className="Genrative-content">
                    Get genrative AI Solution for your problem
                  </div>
                  <button className="Genrative-button" onClick={handlegenrate}>
                    Generate
                  </button>
                </>
              )}
              {!genrate && (
                <>
                  <div className="refresh-button" onClick={handlerefresh}>
                    <VscRefresh />
                  </div>
                  <div
                    className="Answer-box"
                    style={
                      active
                        ? { height: "100px", overflow: "hidden" }
                        : { overflowX: "scroll" }
                    }
                  >
                    <span style={{ fontSize: "20px" }}>Answer</span>
                    <pre>{Ans}</pre>
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
                </>
              )}
            </div>
            <div className="post-container">
              <label className="addImg" onClick={() => handlestat()}>
                <input
                  // className="inputImg"
                  // id="inputImg"
                  type="file"
                  //    style={{visibility:"hidden"}}
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    handleImageChange(e);
                  }}
                />
                <FaImage />
              </label>

              <button className="Create-post" onClick={handlepost}>
                POST
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
        <div className="Posts-container">
          {cards?.length > 0 &&
            cards?.map((e, index) => (
              <div className="Post">
                <div className="Post-header">
                  <div className="ProfileIcon" style={{ cursor: "pointer",position:"relative" }}>
                    <img src={tempuser.img} alt="icon" className="image" />
                {userJs.occupation=="Teacher"&&<span class="goldBG goldText fix">Professor</span>}    
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
                  onClick={() => {urlsearchParams.set("qid",e?._id);navigate(`/question/${index}?`+urlsearchParams.toString())}}
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
      {userJs.occupation!=="Teacher"&&   <div className="Teaching" onClick={handleOpenDialog}>
        Teaching ?
      </div>}
      <div className="MyQuestionContainer">
        <div className="MyQuestions">
          <div className="MyQuestions-header">My Questions</div>
          <div className="MyQuestions-content">
            <div className="MyQuestions-content-container">
              {cards.length == 0 && (
                <div className="No-questions">No Questions Asked</div>
              )}
              {cards?.map((e, i) => {
                return (
                  <>
                    <div
                      className="MyQuestions-content-box"
                      onClick={() => {urlsearchParams.set("qid",e?._id);navigate(`/question/${i}`+urlsearchParams.toString())}}
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

export default Home;
