import {db} from "../firebase";
import {getDocs, collection} from "firebase/firestore";

export const fetchEvents = async()=>{
    let snapshot = await getDocs(collection(db,"events"))
    return snapshot.docs.map(docs=>({id:docs.id, ...docs.data()}))
}