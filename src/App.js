import axios from "axios";
import { useReducer } from "react";
import { format, parseISO } from "date-fns";

const apiInstance = axios.create({
  baseURL: "https://reqres.in/api"
});

const initialState = {
  name: "",
  role: "",
  display: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_DISPLAY":
      return { ...state, display: action.payload };
    default:
      return state;
  }
};

const fieldStyle = {
  marginTop: "20px",
  float: "left",
  width: "70%",
  fontSize: 20,
};
const buttonStyle = {
  marginTop: "20px",
  backgroundColor: "lightBlue",
  width: "30%",
  fontSize: 20,
  cursor: "pointer",
  marginRight: "20px",
};

async function submit(dispatch, state) {
  try {
    const res = await apiInstance.post(`/users`, {
      name: state.name,
      job: state.role,
    });
    const displayText = `${state.name} is appointed as ${
      state.role
    } on ${format(parseISO(res.data.createdAt), "dd-MMM-yyyy")} with ID ${
      res.data.id
    }`;
    dispatch({ type: "SET_DISPLAY", payload: displayText });
  } catch (error) {
    console.error(error);
  }
}

async function getManagerName(dispatch) {
  try {
    const res = await apiInstance.get(`/users/2`);
    const displayText = `${res.data.data.first_name} is the manager. The contact email is ${res.data.data.email}`;
    dispatch({ type: "SET_DISPLAY", payload: displayText });
  } catch (error) {
    console.error(error);
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ width: "100%" }}>
      <input
        placeholder="Name"
        value={state.name}
        style={fieldStyle}
        onChange={(e) =>
          dispatch({ type: "SET_NAME", payload: e.target.value })
        }
      />
      <input
        placeholder="Role"
        value={state.role}
        style={fieldStyle}
        onChange={(e) =>
          dispatch({ type: "SET_ROLE", payload: e.target.value })
        }
      />
      <button style={buttonStyle} onClick={() => submit(dispatch, state)}>
        Submit
      </button>

      <button style={buttonStyle} onClick={() => getManagerName(dispatch)}>
        Get Manager name
      </button>
      <br />
      {state.display && <label style={fieldStyle}>{state.display}</label>}
    </div>
  );
}
export default App;
