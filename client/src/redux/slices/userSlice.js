import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    id: '',
    isAdmin: false,
    city: ''
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', phone = '', address = '', avatar = '', access_token = '', _id = '', isAdmin, city='' } = action.payload
            state.name = name || state.name;
            state.email = email  || state.email;
            state.phone = phone || state.phone;
            state.address = address || state.address;
            state.avatar = avatar || state.avatar;
            state.id = _id || state.id;
            state.access_token = access_token || state.access_token;
            state.isAdmin = isAdmin || state.isAdmin;
            state.city = city || state.city
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.access_token = false;
            state.city = ''
        }
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
