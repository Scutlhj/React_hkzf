import { configureStore } from "@reduxjs/toolkit";
import cityStore from "./modules/city.Store";
import filterSelectedStore from "./modules/filterSelected.Store";
import userStore from "./modules/user.Store";

const store = configureStore({
    reducer: {
        city: cityStore,
        filterSelected: filterSelectedStore,
        user: userStore
    }
});

export default store;