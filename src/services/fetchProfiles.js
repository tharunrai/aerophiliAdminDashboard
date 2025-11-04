import {db} from "../firebase";
import {getDocs, collection , doc , getDoc} from "firebase/firestore";

export const fetchUsers= async() =>{
    const snapshot = await getDocs(collection(db,"profiles"));
    return snapshot.docs.map(docs=>({id:docs.id, ...docs.data()}))
}

export const fetchUsersById = async(userId) => {
    if(!userId){
        console.error("Please Provide User Id ...")
        return null;
    }

    const userdoc = doc(db,"profiles",userId);

    const userInfo = await getDoc(userdoc)

     return { id: userInfo.id, ...userInfo.data() };
}