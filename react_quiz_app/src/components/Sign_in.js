import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign_in.css";
import { useNavigate } from "react-router-dom";

function Sign_in() {
  const [username, setUsername] = useState();
  const [mail, setMail] = useState();
  const [password, setpassword] = useState();
  const [question_count, setQuestion_count] = useState(4);
  const [timer, setTimer] = useState(1);
  const navigate = useNavigate();

  function model_submit() {
    let pattern = /^[+]?[1-9]\d*?[0]*$/;
    if (question_count == "" && timer == "") {
      toast("Pls fill the question count and timer fields in settings tab", {
        type: "error",
      });
      return false;
    } else if (!pattern.test(question_count) || !pattern.test(timer)) {
      toast("Pls provide positive non-zero value", {
        type: "error",
      });
      setQuestion_count("");
      setTimer("");
      return false;
    } else {
      return true;
    }
  }

  function handle_click(e) {
    e.preventDefault();
    var is_chk = model_submit();
    if (is_chk) {
      if (!username == "" && !password == "" && !mail == "") {
        window.localStorage.setItem("username", username);
        navigate("/timeline", {
          state: {
            username: username,
            question_count: question_count,
            timer: timer,
          },
        });
        // navigate("/logout");
      } else {
        toast("Pls fill all the fields", { type: "error" });
      }
    }
  }
  return (
    <div className="sign_in_bg_image">
      <ToastContainer position="top-right" theme="dark" />
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-light border border-2 border-dark"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{ borderRadius: "8px 0px 0px 8px", float: "right" }}
      >
        <i className="fa-solid fa-gear fa-1x settings_icon"></i>
      </button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Settings
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="">
                <div>
                  <label className="control-label mt-0">
                    How many questions do you need in this quiz ?
                    <span className="text-danger"> *</span>
                  </label>
                </div>
                <div>
                  <input
                    className="form-control "
                    type="number"
                    placeholder="Enter Username"
                    name="question_count"
                    value={question_count}
                    onChange={(e) => {
                      setQuestion_count(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <label className="control-label ">
                    Set timer for this quiz :
                    <span className="text-danger">(in minutes) *</span>
                  </label>
                </div>
                <div>
                  <input
                    className="form-control "
                    type="number"
                    placeholder="Enter Username"
                    name="timer"
                    value={timer}
                    onChange={(e) => {
                      setTimer(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  model_submit();
                }}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="background ">
          <div className="shape "></div>
          <div className="shape "></div>
        </div>
        <form className="form overflow-hidden">
          <h3>Login Here</h3>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Full Name"
            id="name"
            className="input"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />

          <label htmlFor="username">Mail ID</label>
          <input
            type="email"
            placeholder="Email or Phone"
            id="username"
            className="input"
            onChange={(e) => {
              setMail(e.target.value);
            }}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="input"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            required
          />

          <button
            className="button"
            onClick={(e) => {
              handle_click(e);
            }}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
export default Sign_in;
