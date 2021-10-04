import MOCK_DATA from "../utils/MOCK_DATA.json";
import axios from "axios";
import { createContext, useReducer } from "react";
import { v4 } from "uuid";
import format from "date-fns/format";
import { useOktaAuth } from "@okta/okta-react";
import { socket } from "../utils/socket";
import React from "react";

import appReducer from "./AppReducer";

const initialState = {
  DDCases: [],
  isOpenModal: false,
  isActivePending: false,
  isActiveConfirmed: false,
  isActiveApplied: false,
  TempCase: [],
  pending: [],
  confirmed: [],
  loading: false,
  showPreviousCases: false,
  permision: true,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  //reducer
  const [state, dispatch] = useReducer(appReducer, initialState);

  //okta role
  const { authState } = useOktaAuth();
  const role = authState.accessToken.claims.role;

  //notify
  function notifyMe(msg) {
    // Comprobamos si el navegador soporta las notificaciones
    if (!("Notification" in window)) {
      alert("Este navegador no soporta las notificaciones del sistema");
    }

    // Comprobamos si ya nos habían dado permiso
    else if (Notification.permission === "granted") {
      // Si esta correcto lanzamos la notificación
      var n = new Notification("Twilio Notification", {
        body: msg,
        icon:
          "https://www.twilio.com/docs/static/company/img/logos/red/twilio-mark-red.cccc9da10.png",
      });
      setTimeout(n.close.bind(n), 8000);
    }

    // Si no, tendremos que pedir permiso al usuario
    else if (Notification.permission !== "denied") {
      console.log("no permitions 111111111111111");
      Notification.requestPermission(function (permission) {
        // Si el usuario acepta, lanzamos la notificación
        if (permission === "granted") {
          new Notification("Notifications Granted!");
        }
      });
    }

    // Finalmente, si el usuario te ha denegado el permiso y
    // quieres ser respetuoso no hay necesidad molestar más.
  }

  //socket
  React.useEffect(() => {
    socket.on("reload:server", (data, type, roleWhoEmit) => {
      console.log(data);
      switch (type) {
        case "ADD_CASE":
          if (role === "contable") {
            notifyMe("Tiene un caso nuevo por revisar");
          }
          dispatch({
            type: "ADD_CASE",
            payload: data,
          });
          break;

        case "UPDATE_CASE":
          dispatch({
            type: "UPDATE_CASE",
            payload: data,
          });
          if (
            role === "admin" &&
            roleWhoEmit === "contable" &&
            data &&
            data.status === "confirmed"
          ) {
            notifyMe("Tiene un caso nuevo por revisar");
          }

        case "DELETE_CASE":
          dispatch({
            type: "DELETE_CASE",
            payload: data,
          });
      }
    });
  }, []);

  //functions
  async function addCase(data, file) {
    try {
      let dataAxios = JSON.stringify(data);
      let config = {
        method: "post",
        url: "http://localhost:5000/api/cases/",
        headers: {
          "Content-Type": "application/json",
        },
        data: dataAxios,
      };

      const response = await axios(config);

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:5000/api/cases/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("image ready");
      }

      socket.emit("reload:client", response.data, "ADD_CASE");

      dispatch({
        type: "ADD_CASE",
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateCase(updatedCase, file) {
    try {
      const id = updatedCase._id;
      let dataAxios = JSON.stringify(updatedCase);
      let config = {
        method: "put",
        url: `http://localhost:5000/api/cases/${id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: dataAxios,
      };

      const response = await axios(config);
      socket.emit("reload:client", response.data, "UPDATE_CASE", role);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:5000/api/cases/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("image ready");
      }

      dispatch({
        type: "UPDATE_CASE",
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function deleteCase(id) {
    axios.delete(`http://localhost:5000/api/cases/${id}`);

    socket.emit("reload:client", id, "DELETE_CASE");
    dispatch({
      type: "DELETE_CASE",
      payload: id,
    });
  }

  function filterByStatus(status) {
    dispatch({
      type: "FILTER_BY_STATUS",
      payload: status,
    });
  }

  async function getInitialData() {
    const response = await axios.get("http://localhost:5000/api/cases/");

    dispatch({
      type: "GET_INITIAL_DATA",
      payload: response.data,
    });
  }

  async function getData(startDate, endDate) {
    // const response = await axios.get('http://localhost:5000/api/cases/');

    const config = {
      method: "post",
      url: "http://localhost:5000/api/cases/data",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        startDate,
        endDate,
      }),
    };

    const response = await axios(config);
    dispatch({
      type: "GET_DATA_BY_DATE",
      payload: response.data,
    });
  }

  function openModal(isOpen) {
    dispatch({
      type: "OPEN_MODAL",
      payload: isOpen,
    });
  }

  function AddToTempCase(id) {
    console.log(id);
    dispatch({
      type: "ADD_TEMP_CASE",
      payload: id,
    });
  }

  function deleteTempCase() {
    dispatch({
      type: "DELETE_TEMP_CASE",
    });
  }

  function changeStatus(id) {
    dispatch({
      type: "CHANGE_STATUS",
      payload: id,
    });
  }

  async function getPreviousCases() {
    const config = {
      method: "post",
      url: "http://localhost:5000/api/cases/previousCases",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        status1: "pending",
        status2: "confirmed",
      }),
    };

    const responsePendingCases = await axios(config);

    dispatch({
      type: "GET_PREVIOUS_CASES",
      payload: responsePendingCases.data,
    });
  }

  async function setShowPreviousCases() {
    dispatch({
      type: "SET_SHOW_PREVIOUS_CASES",
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        DDCases: state?.DDCases,
        isOpenModal: state?.isOpenModal,
        TempCase: state?.TempCase,
        isActivePending: state?.isActivePending,
        isActiveConfirmed: state?.isActiveConfirmed,
        isActiveApplied: state?.isActiveApplied,
        pending: state?.pending,
        confirmed: state?.confirmed,
        loading: state?.loading,
        showPreviousCases: state?.showPreviousCases,
        role,
        filterByStatus,
        getInitialData,
        getData,
        addCase,
        updateCase,
        deleteCase,
        openModal,
        AddToTempCase,
        deleteTempCase,
        changeStatus,
        getPreviousCases,
        setShowPreviousCases,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
