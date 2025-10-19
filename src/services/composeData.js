import { fetchRegistrations } from "../services/fetchRegistration";
import { fetchEvents } from "../services/fetchEvents";
import { fetchUsers } from "./fetchProfiles";

export const composed = async()=> {
    try{
    const [registrations, events, users]=await Promise.all([fetchRegistrations(),fetchEvents(), fetchUsers()])
    
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

    

    console.log(userMap);
    
    const eventWithName = registrations.map(r=>({ ...r, eventName : eventMap[r.eventId]||"not found", userName : userMap[r.registrant_id]||"not found"}))

    eventWithName.map(console.log)
    
    return eventWithName;
}catch (error) {
    console.error("Error fetching registrations with event name:", error);
    return [];
  }
}