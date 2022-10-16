import React, { createContext, useEffect, useState } from 'react'
import { useContext } from 'react';

const stateContext = createContext();

export const contextType = {
    user : 'user',
    participant : 'participant'
}

const getFreshContext = ()=>{
    if(localStorage.getItem('context')==null){
        localStorage.setItem('context', JSON.stringify(
            {
                userId : 0,
                userEmail : '',
                participantId : 0,
                timeTaken : 0,
                quizCode : 0,
                selectedOptions : [],
                score:0
            }
        ));
    }
    return JSON.parse(localStorage.getItem('context'));
}

export default function useStateContext() {
    const {context, setContext} = useContext(stateContext);
    return {
        context,
        setContext : obj=>{setContext({...context, ...obj})},
        resetContext: ()=>{
            localStorage.removeItem('context');
            setContext(getFreshContext());
        }
    } 
}

export function ContextProvider(props) {
    const [context, setContext] = useState(getFreshContext());
    useEffect(()=>{
        localStorage.setItem('context',JSON.stringify(context));
    },[context]);
    return (
        <stateContext.Provider value={{context, setContext}}>
            {props.children}
        </stateContext.Provider>
    )
}
