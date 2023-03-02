import {
  collection,
  getDocs,
  query,
} from 'firebase/firestore';

import { fetchDb } from './firestore';

const db = fetchDb();
const q = query(collection(db, "contestData"));

export async function getContestsData(id: string) {
    console.log("id: ", id)
    const documents = await getDocs(q);
    console.log("documents", documents)
    const res = documents.docs.map(
        (item) => {
            if (item.id == id) {
                return {
                    params: {
                        id: item.id.toString(),
                        data: item.data()   
                    }
                }   
            } else {
              return null
            }    
    }
    )
    console.log("res", res)
    const filtered = res.filter((re) => {
        if (re != null) {
           return re 
        }
    })
    console.log("filtered", filtered)
    return filtered
}

export async function getAllIds(){
    const documents = await getDocs(q);
    const res = documents.docs.map((item) => {
        return {
            params: {
                id: item.id
            }
        }       
    })
    return res
}