import {useEffect,useState} from "react"
import { fetchRegistrations } from "../services/fetchRegistration";
import { composed } from "../services/composeData";


const Registration = ()=> {
const [participant,setParticipant]= useState([]);

useEffect(()=>{
    composed().then(setParticipant);
},[]);

    return(
        <>
            <div>
                {participant.map((d)=>(
                    <ol key={d.id}>
                    <li>Registrant Name : {d.userName}</li>
                    <li>Event Id : {d.eventName}</li>
                    <li>Payment Id : {d.payment_id||"Yet To Pay"}</li>
                    <li>Status : {d.status?"True":"False"}</li>
                    <li>Team Id : {d.teamId||"Not There"}</li>
                    <li>Team Event : {d.team_event?"True":"False"}</li>
                    </ol>
                    ))}
            </div>

        </>
    )

}
export default Registration;