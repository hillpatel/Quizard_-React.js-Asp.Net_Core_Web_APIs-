import axios from "axios";

export const BASE_URL = "https://localhost:44326";

export const Endpoints = {
    participants : "Participants",
    questions : "Questions",
    quizCreators : "QuizCreators",
    quizs : "Quizs"
}

export const createAPIEndpoint = (endpoint)=>{
    let url = `${BASE_URL}/api/${endpoint}/`;
    return {
        fetch : ()=>axios.get(url),
        fetchPagination : input=>axios.post(url, input),
        fetchById : id=>axios.get(url+id),
        post : newRecord=>axios.post(url,newRecord),
        put : (id, updatedRecord)=>axios.put(url+id, updatedRecord),
        delete : id=>axios.delete(url+id)
    }
}