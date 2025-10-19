import {db} from "../firebase";
import {getDocs, collection} from "firebase/firestore";

export const fetchUsers= async() =>{
    const snapshot = await getDocs(collection(db,"profiles"));
    return snapshot.docs.map(docs=>({id:docs.id, ...docs.data()}))
}