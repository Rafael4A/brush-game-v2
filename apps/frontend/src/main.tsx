import React from "react";

import isPropValid from "@emotion/is-prop-valid";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { StyleSheetManager, ThemeProvider } from "styled-components";

import {
  LocalRoomProvider,
  NicknameProvider,
  PlayerIdProvider,
  RoomProvider,
} from "./context";
import { theme } from "./resources/theme";
import { router } from "./Router";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <StyleSheetManager shouldForwardProp={isPropValid}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <PlayerIdProvider>
              <NicknameProvider>
                <RoomProvider>
                  <LocalRoomProvider>
                    <RouterProvider router={router} />
                    <ToastContainer
                      position="top-right"
                      autoClose={2500}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable={false}
                      pauseOnHover
                      theme="dark"
                      className="custom-toast"
                    />
                  </LocalRoomProvider>
                </RoomProvider>
              </NicknameProvider>
            </PlayerIdProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </StyleSheetManager>
    </HelmetProvider>
  </React.StrictMode>
);
