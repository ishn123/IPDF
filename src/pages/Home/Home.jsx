import React, { useState } from 'react'
import "./style.css"
import Navbar from '../../Components/Navbar/Navbar'
function Home() {
    const temp=[40,10,54,56,38,90,100,89,23,4,5,6,7];
    const [question,setquestion]=useState("");
    const [genrate,setgenrate]=useState(true);
    const [active,setactive]=useState(true);
    return (
        <div className='main'>
            <Navbar></Navbar>
            {/* <div className='Menu-item'></div> */}
            <div className='Home'>
             <div className='Questions-container'>
                <div className='AskQuestions'>
                  <div className='AskQuestions-header'>Ask a Question</div>
                  <input type="text" className='Input-text' value={question} placeholder='Write a question' onChange={(e)=>setquestion(e.target.value)}/>
                  <div className='Genrative-AI'>
                    {genrate&&(<> <div className='Genrative-content'>Get genrative AI Solution for your problem</div>
                    <button className="Genrative-button" onClick={()=>setgenrate(!genrate)}>Generate</button>
                    </>
                 )}
                 { !genrate&&(
                    <>
                    <div className='Answer-box' style={active?{height:"100px"}:{}}>
                   <span style={{fontSize:"20px"}}>Answer</span>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium nisi totam maxime soluta, quod rem sequi, voluptate nam nihil ex molestias debitis! Dicta sequi maiores eveniet, nisi amet ad, commodi voluptas alias, ipsa quasi laudantium optio. Sequi ducimus cumque dignissimos. Vitae ipsam consequuntur molestias itaque? Maiores quibusdam doloribus officia dolorem, cumque alias illum. Fugiat ut hic, nam nemo molestiae provident similique nisi facilis unde culpa nostrum tenetur laboriosam fuga itaque sequi quis a quaerat repellat aspernatur, ipsa placeat minus! Placeat sunt ad, odio quod praesentium quas aliquam dolore excepturi quasi fuga, alias dignissimos repellat maxime? Repellat, consequatur? Dignissimos nemo quidem odio blanditiis excepturi quas laboriosam error amet pariatur dicta sapiente debitis ipsam architecto eveniet, aliquam quo. Nostrum vel beatae voluptatibus.
                    </div>
                    <div className='See-more' style={active?{}:{display:"none"}} onClick={()=>setactive(!active)}>See More...</div>
                    </>
                 )

                 }
                    </div>
                  <button className="Create-post">
                    POST
                  </button>
                </div>
             </div>
            </div>
            <div className='MyQuestionContainer'>
            <div className='MyQuestions'>
            <div className='MyQuestions-header'>My Questions</div>
                    <div className='MyQuestions-content'>
                        <div className='MyQuestions-content-container'>
                        {temp.map((e,i)=>{
                          return <>
                            <div className='MyQuestions-content-box'>
                            <div className='MyQuestions-content-title'><span>What Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam ipsam tempora, ab quis cum iure aut nobis, ipsa libero, omnis dolores eligendi est veniam adipisci! Esse ipsam magni harum ducimus!</span>?</div>
                            <div className='MyQuestions-content-votes'>Votes:{e}</div>
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
