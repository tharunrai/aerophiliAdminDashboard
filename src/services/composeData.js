import { fetchRegistrations } from "../services/fetchRegistration";
import { fetchEvents } from "../services/fetchEvents";
import { fetchUsers, fetchUsersById } from "./fetchProfiles";
import { fetchTeams } from "./fetchTeams";

export const composed = async () => {
  try {
    const [registrations, events, users, teams] = await Promise.all([fetchRegistrations(), fetchEvents(), fetchUsers(), fetchTeams()])


    // making object like eventId : eventName
    const eventMap = {};
    events.forEach(ev => {
      eventMap[ev.event_id] = ev.title;
    });
    // making object like eventId : eventName
    const eventAmountMap = {};
    events.forEach(ev => {
      eventAmountMap[ev.event_id] = ev.payment_amount;
    });

    // making object like uid : name
    const userMap = {};
    users.forEach(u => {
      userMap[u.id] = u.fullName;
    });

    //making object like teamid : teamName
    const teamMap = {};
    teams.forEach(t => {
      teamMap[t.id] = t.teamName;
    });
    //making object like teamid : teamaccomodation
    const teamAccMap = {};
    teams.forEach(t => {
      teamAccMap[t.id] = t.needAccommodation ? "YES" : "NO";

    });

    const teamLeaderMap = {};
    teams.forEach(t => {
      teamLeaderMap[t.id] = t.leader;
    });


    const eventWithName = registrations.map(r => ({ ...r, eventName: eventMap[r.eventId] || "N/A", userName: userMap[r.registrant_id] || "N/A", teamName: teamMap[r.teamId] || "N/A", teamAcc: teamAccMap[r.teamId] || "N/A", eventAmount: eventAmountMap[r.eventId] || "N/A", leaderId: teamLeaderMap[r.teamId] }))

    console.log(eventWithName.teamAcc)

    return eventWithName;
  } catch (error) {
    console.error("Error fetching :", error);
    return [];
  }
}


export const getPhoneNo = async () => {
  const teams = await fetchTeams();

  const phoneMap = {};

  await Promise.all(
    teams.map(async (team) => {
      const leaderId = team.leader;
      const user = await fetchUsersById(leaderId);

      if (user && user.phoneNo) {
        let phone = user.phoneNo;
        if (phone.startsWith("+91")) {
          phone = phone.slice(3);
        }
        phoneMap[leaderId] = phone.trim();
      }
    })
  );

  return phoneMap;
};