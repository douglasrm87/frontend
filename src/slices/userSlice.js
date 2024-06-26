import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

const initialState = {
  user: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};
// Get user details, for edit data
export const profile = createAsyncThunk("user/profile",
  async (user, thunkAPI) => {
    // obter o token do redux
    // auth.user.token salvo no authslice.js
    const token = thunkAPI.getState().auth.user.token;
    const data = await userService.profile(user, token);
    console.log("Logando userslice.js função profile: ",data);
    return data;
  }
);

// Função para acessar o userService.js
// Get user details
export const getUserDetails = createAsyncThunk("user/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await userService.getUserDetails(id, token);
    console.log(data);
    return data;
  }
);

// Update user details
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.updateProfile(user, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    console.log(data);

    return data;
  }
);
// Criando o reducer do usuário
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null; // ou false
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        console.log ("Passando por - updateProfile.fulfilled")
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        console.log ("Corrigindo o null do Atualizar em EditProfile")
        state.loading = false;
        state.error = action.payload;
        state.user = {}; // Trocar null por objeto vazio
      })
      .addCase(getUserDetails.pending, (state) => { // funcao em userSlice.js
        state.loading = true;
        state.error = null; // ou false
      })
      .addCase(getUserDetails.fulfilled, (state, action) => { // quando completa a requsiição
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      });
  },
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;
