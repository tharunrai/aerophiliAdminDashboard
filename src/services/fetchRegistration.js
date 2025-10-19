import {db} from "../firebase";
import {getDocs, collection} from "firebase/firestore";

export const fetchRegistrations= async() =>{
    const snapshot = await getDocs(collection(db,"registrations"));
    return snapshot.docs.map(docs=>({id:docs.id, ...docs.data()}))
}


