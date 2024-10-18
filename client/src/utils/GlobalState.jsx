import { createContext, useReducer, useContext } from "react";
import { reducer, intialState } from "./reducers";

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);


export const GlobalStateProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer,intialState);

    return(
        <GlobalStateContext.Provider value={[state,dispatch]}>
            {children}
        </GlobalStateContext.Provider>
    )
}