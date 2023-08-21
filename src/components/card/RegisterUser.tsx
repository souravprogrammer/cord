import React, { useReducer } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { registerUser, createThread } from "@/utils/QueryClient";
import { useMutation } from "react-query";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
type Props = {
  elevation?: number;
};

type Action = {
  type: "name" | "email" | "password" | "reset";
  payload: string;
};
type FormState = {
  name: string;
  email: string;
  password: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
};
function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export default function RegisterUser({ elevation }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { mutate, isLoading, isSuccess, isError, isIdle } = useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      dispatch({ type: "reset", payload: "" });
    },
    onSettled: async () => {},
  });
  return (
    <Paper
      elevation={elevation ?? 1}
      sx={{
        boxShadow: "none",
        padding: "26px 28px",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        margin: "8px",
      }}
    >
      {isIdle ? (
        <>
          <Typography variant="h4">Create your account</Typography>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              mutate({
                user: {
                  ...state,
                },
              });
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <TextField
              label="name"
              value={state.name}
              placeholder="mike Ross"
              onChange={(e) => {
                dispatch({ type: "name", payload: e.target.value });
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={state.email}
              placeholder="ross@suits.com"
              onChange={(e) => {
                dispatch({ type: "email", payload: e.target.value });
              }}
            />
            <TextField
              label="password"
              type="password"
              value={state.password}
              placeholder="*****"
              onChange={(e) => {
                dispatch({ type: "password", payload: e.target.value });
              }}
            />
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              sx={{
                borderRadius: "20px",
              }}
            >
              {isLoading ? <CircularProgress /> : "register"}
            </Button>
          </form>
        </>
      ) : null}
      {isSuccess ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "center",
          }}
        >
          <CheckCircleIcon
            color="success"
            sx={{
              width: "64px",
              height: "64px",
            }}
          />
          <Typography variant="h4">
            User has been registered successfully
          </Typography>
        </Box>
      ) : null}
      {isError ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "center",
          }}
        >
          <ErrorIcon
            color="error"
            sx={{
              width: "64px",
              height: "64px",
            }}
          />
          <Typography variant="h4">Something Went Wrong</Typography>
        </Box>
      ) : null}
    </Paper>
  );
}
