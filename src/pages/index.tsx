import Head from "next/head";
import Image from "next/image";
import ButtonGoogle from "@/styles/Button.module.css";
import { Inter } from "next/font/google";
import Button from "@mui/material/Button";
import { Typography, Box, Modal, SwipeableDrawer } from "@mui/material";
import {
  useSession,
  signIn,
  getSession,
  GetSessionParams,
} from "next-auth/react";
import RegisterUser from "@/components/card/RegisterUser";
import { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const ref = useRef<any>();
  return (
    <>
      <Head>
        <title>bird</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main ref={ref}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "4fr 3fr", md: "4fr 3fr" },
            height: "100dvh",
          }}
        >
          <Box
            sx={{
              display: {
                md: "block",
                sm: "block",
                xs: "none",
              },
              background:
                "linear-gradient(212.38deg, rgba(85, 110, 230, 0.7) 0%, rgba(147, 165, 255, 0.71) 100%),url(https://static.seattletimes.com/wp-content/uploads/2019/01/web-typing-ergonomics-1020x680.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              //"linear-gradient(212.38deg, rgba(85, 110, 230, 0.7) 0%, rgba(147, 165, 255, 0.71) 100%),url(https://static.seattletimes.com/wp-content/uploads/2019/01/web-typing-ergonomics-1020x680.jpg)",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "34px",
              alingItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "blue",
                borderRadius: "50%",
                width: "48px",
                aspectRatio: "1 / 1",
                marginTop: "48px",
                marginBottom: "48px",
              }}
            ></div>
            <Typography variant="h2" fontWeight={"bold"} py={3}>
              Happening now
            </Typography>
            <Typography variant="h4" fontWeight={"bold"} py={3}>
              Join [Twitter] today.
            </Typography>
            <Box
              sx={{
                maxWidth: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // border: "1px solid red",
              }}
            >
              <button className={ButtonGoogle.googleBtn}>
                Sign in with Google
              </button>
              <button
                className={ButtonGoogle.gitHubbtn}
                style={{ marginTop: "24px" }}
                onClick={() => {
                  signIn();
                }}
              >
                Sign in with GitHub
              </button>
              <Typography fontWeight={"bold"} textAlign={"center"} py={2}>
                or
              </Typography>
              <Button
                variant="contained"
                sx={{ borderRadius: "20px", width: "100%" }}
                onClick={() => {
                  // signIn();
                  setOpenModal(true);
                }}
              >
                Create account
              </Button>
              <Typography
                fontWeight={"bold"}
                textAlign={"center"}
                py={2}
                variant="body2"
              >
                Already have an account?
              </Typography>
              <Button
                variant="outlined"
                sx={{ borderRadius: "20px", width: "100%" }}
                onClick={() => {
                  signIn();
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Box>
        <Modal
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          sx={{
            display: { xs: "none", sm: "none", md: "grid" },
            placeItems: "center",
          }}
        >
          <Box>
            <RegisterUser />
          </Box>
        </Modal>
        <SwipeableDrawer
          sx={{
            display: {
              xs: "block",
              sm: "block",
              md: "none",
            },
          }}
          container={ref.current as any}
          open={openModal}
          anchor="bottom"
          onClose={() => {
            setOpenModal(false);
          }}
          onOpen={() => {
            setOpenModal(true);
          }}
          swipeAreaWidth={0}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: false,
          }}
        >
          <Box
            sx={{
              height: "90dvh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <RegisterUser elevation={0} />
          </Box>
        </SwipeableDrawer>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (session !== null) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
