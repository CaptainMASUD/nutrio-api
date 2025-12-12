import { configureStore, combineReducers } from "@reduxjs/toolkit"; 
import userReducer from "/src/Redux/UserSlice/UserSlice.js";
import {persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"
import persistStore from "redux-persist/es/persistStore";

const rootRuducer = combineReducers({
    user : userReducer,
})

const persistConfig = {
    key : 'root',
    storage,
    version : 1,

}


const persistedRuducer = persistReducer(persistConfig,rootRuducer) 

export const store = configureStore({
    reducer: persistedRuducer,
    middleware :(getDefaultMiddleware)=>
        getDefaultMiddleware({serializableCheck : false})
});

export const persistor = persistStore(store)
