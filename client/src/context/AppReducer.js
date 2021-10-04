export default function appReducer(state, action) {
  switch (action.type) {
    // return {
    //   ...state,
    //   DDCases: [...state.DDCases[0], action.payload],
    // };

    case 'UPDATE_CASE': {
      const updatedCase = action.payload;

      const updatedCases = state?.DDCases?.map((e) => {
        if (e._id === updatedCase._id) {
          return updatedCase;
        }
        return e;
      });

      const updatedCasesPending = state?.pending?.map((e) => {
        if (e._id === updatedCase._id) {
          return updatedCase;
        }
        return e;
      });

      const updatedCasesConfirmed = state?.confirmed?.map((e) => {
        if (e._id === updatedCase._id) {
          return updatedCase;
        }
        return e;
      });

      return {
        ...state,
        DDCases: updatedCases,
        pending: updatedCasesPending,
        confirmed: updatedCasesConfirmed,
      };
    }

    case 'ADD_CASE':
      if (action.payload) {
        return {
          ...state,
          DDCases: [...state.DDCases, action.payload],
        };
      } else {
        return state;
      }

    case 'DELETE_CASE':
      return {
        ...state,
        DDCases: state.DDCases.filter((e) => e._id !== action.payload),
      };

    case 'FILTER_BY_STATUS':
      if (action.payload) {
        if (action.payload === 'pending') {
          return {
            ...state,
            isActivePending: !state.isActivePending,
          };
        } else if (action.payload === 'confirmed') {
          return {
            ...state,
            isActiveConfirmed: !state.isActiveConfirmed,
          };
        } else if (action.payload === 'applied') {
          return {
            ...state,
            isActiveApplied: !state.isActiveApplied,
          };
        }
      }
      break;
    case 'GET_INITIAL_DATA':
      if (action.payload) {
        return {
          ...state,
          DDCases: action.payload,
        };
      }
      break;

    case 'GET_DATA_BY_DATE':
      if (action.payload) {
        return {
          ...state,
          DDCases: action.payload,
        };
      }
      break;
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpenModal: !state.isOpenModal,
      };

    case 'ADD_TEMP_CASE':
      const pendingAndConfirmed = [...state.pending, ...state.confirmed];
      const pending = pendingAndConfirmed.filter(
        (e) => e._id === action.payload
      );
      if (pending.length > 0) {
        return {
          ...state,
          TempCase: pending,
        };
      } else {
        return {
          ...state,
          TempCase: state.DDCases.filter((e) => e._id === action.payload),
        };
      }

    case 'DELETE_TEMP_CASE':
      return {
        ...state,
        TempCase: {},
      };
    case 'GET_PREVIOUS_CASES':
      const previousPending = action.payload.filter(
        (e) => e.status === 'pending'
      );
      const previousConfirmed = action.payload.filter(
        (e) => e.status === 'confirmed'
      );
      return {
        ...state,
        pending: previousPending,
        confirmed: previousConfirmed,
        loading: true,
      };

    // case "CHANGE_STATUS":
    //   const updatedCase = state?.DDCases?.filter(
    //     (e) => e._id === action.payload
    //   );

    //   if (updatedCase[0].status === "pending") {
    //     updatedCase[0].status = "confirmed";
    //     return {
    //       ...state,
    //       DDCases: [
    //         ...state.DDCases.filter((e) => e._id !== updatedCase[0]._id),
    //         updatedCase[0],
    //       ],
    //     };
    //   } else {
    //     return state;
    //   }

    case 'SET_SHOW_PREVIOUS_CASES':
      return {
        ...state,
        showPreviousCases: !state.showPreviousCases,
      };

    case 'SET_PERMISION':
      return {
        ...state,
        permision: !state.permision,
      };

    default:
      return state;
  }
}
