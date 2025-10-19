import { fetchRegistrations } from "../services/fetchRegistration";
import { fetchEvents } from "../services/fetchEvents";
import { fetchUsers } from "./fetchProfiles";
import { fetchTeams } from "./fetchTeams";

export const composed = async()=> {
    try{
    const [registrations, events, users, teams]=await Promise.all([fetchRegistrations(),fetchEvents(), fetchUsers(),fetchTeams()])
    
    // making object like eventId : eventName
    const eventMap ={};
    events.forEach(ev => {
        eventMap[ev.event_id]=ev.title;
    });

    // making object like uid : name
    const userMap = {};
        users.forEach(u => {
            userMap[u.id]=u.fullName;
        });

    //making object like teamid : teamName
    const teamMap = {};
        teams.forEach(t => {
            teamMap[t.id]=t.teamName;
        });

    

    console.log(userMap);
    
    const eventWithName = registrations.map(r=>({ ...r, eventName : eventMap[r.eventId]||"not found", userName : userMap[r.registrant_id]||"not found", teamName : teamMap[r.teamId]||"not found"}))

    eventWithName.map(console.log)
    
    return eventWithName;
}catch (error) {
    console.error("Error fetching :", error);
    return [];
  }
}