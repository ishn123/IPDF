import React, { useEffect, useState } from 'react'
import "./style.css"
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
function Navbar(props) {
    const navigate=useNavigate();
    const [active,setactive]=useState(false);
    const [notification, setnotification] = useState();
    useEffect(()=>{
        setnotification(props.notification);
    });
   
    console.log(notification);
    return (
        <div className='Navbar'>
            <h1 style={{cursor:"pointer"}} onClick={()=>{navigate('/home')}}>Query Me</h1>

            <div className='Profile-container'>
                <div className="Nav-Corner">
                    <div className="NotificationIcon" style={{ cursor: "pointer" }} onClick={()=>setactive(!active)}> {<div className="badge">{notification?.length}</div>} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" >
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8336 2.49999C10.8336 2.03975 10.4606 1.66666 10.0003 1.66666C9.54008 1.66666 9.16698 2.03975 9.16698 2.49999V2.97571C6.34021 3.37993 4.16698 5.81018 4.16698 8.74908L4.16698 12.0827C4.16698 12.0827 4.16699 12.0826 4.16698 12.0827C4.1669 12.0843 4.16633 12.0955 4.16272 12.1174C4.15838 12.1436 4.15068 12.1793 4.13797 12.2252C4.11219 12.3183 4.07117 12.4342 4.01387 12.5712C3.89899 12.8459 3.73702 13.1622 3.55789 13.4813C3.2211 14.0813 3.05134 14.7962 3.17879 15.476C3.31319 16.193 3.77468 16.8182 4.56286 17.1183C5.26695 17.3864 6.20417 17.6316 7.44186 17.7775C7.47131 17.803 7.50614 17.8323 7.54614 17.8643C7.67138 17.9644 7.85031 18.0943 8.07645 18.2235C8.52525 18.48 9.18883 18.75 10.0003 18.75C10.8118 18.75 11.4754 18.48 11.9242 18.2235C12.1503 18.0943 12.3292 17.9644 12.4545 17.8643C12.4945 17.8323 12.5293 17.803 12.5588 17.7775C13.7965 17.6316 14.7337 17.3864 15.4378 17.1183C16.2259 16.8182 16.6874 16.193 16.8218 15.476C16.9493 14.7962 16.7795 14.0813 16.4427 13.4813C16.2636 13.1622 16.1016 12.8459 15.9868 12.5712C15.9295 12.4342 15.8884 12.3183 15.8627 12.2252C15.8499 12.1793 15.8422 12.1436 15.8379 12.1174C15.8343 12.0955 15.8337 12.0845 15.8337 12.083C15.8337 12.0828 15.8337 12.083 15.8337 12.083L15.8336 12.0759V8.74948C15.8336 5.81066 13.6605 3.38 10.8336 2.97572V2.49999ZM5.83365 8.74908C5.83365 6.44809 7.69893 4.58332 10.0003 4.58332C12.3016 4.58332 14.167 6.4484 14.167 8.74948V12.0833C14.167 12.4691 14.3115 12.8852 14.4491 13.2143C14.5986 13.5717 14.7945 13.95 14.9894 14.2971C15.1789 14.6347 15.2241 14.9537 15.1837 15.1689C15.1503 15.3471 15.0612 15.4783 14.8447 15.5608C13.949 15.9018 12.4369 16.25 10.0003 16.25C7.56371 16.25 6.05165 15.9018 5.15593 15.5608C4.93939 15.4783 4.85032 15.3471 4.81692 15.1689C4.77656 14.9537 4.82174 14.6347 5.01122 14.2971C5.20609 13.95 5.402 13.5717 5.5515 13.2143C5.6891 12.8852 5.83365 12.4691 5.83365 12.0833V8.74908Z" fill="white" />

                    </svg>
                    <div className="Notification-box" style={active?{}:{display:"none"}}>
                        <div className='Notification-container'>
                            {/* <div className='No-Notification-box'>No Notifications</div> */}
                            {
                                notification?.map((e,i)=>(
                                    <div className='Notification-content'>
                                    {e.text}
                                   <div style={{display:"flex",flexDirection:"row-reverse"}}>{moment(new Date(e.createdAt)).fromNow()}</div>
                               </div>
                                ))
                            }
                         
                        </div>
                    </div>
                    </div>
                    <div className="ProfileIcon" style={{ cursor: "pointer" }}><img src="https://say-data-assignment.vercel.app/static/media/icon.fe59d9d7df33d043cf5a.jpg" alt="icon" className='image' /></div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
