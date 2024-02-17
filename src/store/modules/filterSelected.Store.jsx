import { createSlice } from "@reduxjs/toolkit";

const filterSelectedStore = createSlice({
    name: "filterSelected",
    initialState: {
        defaultSelected: {
            area: ['area', 'null', null, null],
            mode: ['null'],
            price: ['null'],
            more: [],
        },
        // 控制各个item的状态,谁为true则谁绿色高亮
        titleSelectedStatus: {
            area: false,
            mode: false,
            price: false,
            more: false
        },
        // scrollTop: 0
    },
    reducers: {
        setDefaultSelected(state, action) {
            state.defaultSelected = action.payload;
        },
        setTitleSelectedStatus(state, action) {
            state.titleSelectedStatus = action.payload;
        },
        autoResetState(state, action) {
            if (action.payload) {
                state.defaultSelected = {
                    area: ['area', 'null', null, null],
                    mode: ['null'],
                    price: ['null'],
                    more: [],
                }
                state.titleSelectedStatus = {
                    area: false,
                    mode: false,
                    price: false,
                    more: false
                }
                // state.scrollTop = 0
            }
        },
        // setScrollTop(state, action) {
        //     state.scrollTop = action.payload
        // }
    }
});

const { setDefaultSelected, autoResetState, setTitleSelectedStatus } = filterSelectedStore.actions;

export { setDefaultSelected, autoResetState, setTitleSelectedStatus }


export default filterSelectedStore.reducer;