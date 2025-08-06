import { createSlice } from "@reduxjs/toolkit";

// initial state for the category slice
const initialState = {
  categories: [],
  loading: false,
};

//create a slice for user-related state management
const categorySlice = createSlice({
  name: "category",
  initialState,

  //state Update reducers functions
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const { reducer: categoryReducer, actions } = categorySlice;

//destructure actions for easy access
export const { setCategories, setLoading } = actions;
export default categoryReducer;
