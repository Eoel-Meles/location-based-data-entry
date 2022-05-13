import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import "./App.css";
import "bulma/css/bulma.min.css";

import { listLogEntries, regesterUser, loginUser } from "./API";
import LogEntryForm from "./LogEntryForm";

const App = () => {
  return <Mapper />;
};

const Mapper = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 11.5865462,
    longitude: 37.3949829,
    zoom: 12,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };
  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker latitude={entry.latitude} longitude={entry.longitude}>
            <div
              onClick={() =>
                setShowPopup({
                  // ...showPopup,
                  [entry._id]: true,
                })
              }
            >
              <div>
                {entry.icon == null ? (
                  <svg
                    className="marker yellow"
                    style={{
                      height: `${(6 * viewport.zoom) / 2}px`,
                      width: `${(6 * viewport.zoom) / 2}px`,
                    }}
                    version="1.1"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <g>
                        <path
                          d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                        c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                        c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
                        />
                      </g>
                    </g>
                  </svg>
                ) : (
                  <img
                    src={logEntries.icon}
                    alt="icon"
                    style={{
                      height: `${(6 * viewport.zoom) / 2}px`,
                      width: `${(6 * viewport.zoom) / 2}px`,
                    }}
                  />
                )}
              </div>
            </div>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor="top"
            >
              <div className="popup">
                <h3 className="title is-4">{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>
                  Edited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
                {entry.image && <img src={entry.image} alt={entry.title} />}
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}
      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <svg
                className="marker red"
                style={{
                  height: `${(6 * viewport.zoom) / 2}px`,
                  width: `${(6 * viewport.zoom) / 2}px`,
                }}
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
              >
                <g>
                  <g>
                    <path
                      d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                      c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                      c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};

const AuthView = () => {
  const [loginForm, setLoginForm] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { i18n } = useTranslation();

  function toggleLoginForm() {
    setLoginForm(!loginForm);
  }

  function changeLanguage(language) {
    i18n.changeLanguage(language);
  }

  return (
    <div className="auth">
      {loginForm ? (
        <Login
          toggleLoginForm={() => toggleLoginForm()}
          changeLanguage={changeLanguage}
        />
      ) : (
        <Regester
          toggleLoginForm={() => toggleLoginForm()}
          changeLanguage={changeLanguage}
        />
      )}
    </div>
  );
};

const Regester = ({ toggleLoginForm, changeLanguage }) => {
  const [modal, setModal] = React.useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  function toggleModal() {
    setModal(!modal);
  }

  return (
    <>
      <div className={modal ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Terms and Services</p>
            <button
              className="delete"
              aria-label="close"
              onClick={toggleModal}
            ></button>
          </header>
          <section className="modal-card-body">
            Content for terms and services will come in soon with multiple
            language support
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={toggleModal}>
              Ok
            </button>
          </footer>
        </div>
      </div>

      <form onSubmit={handleSubmit(regesterUser)} className="field box">
        <a href="" onClick={() => changeLanguage("en")}>
          En
        </a>
        {" | "}
        <a href="" onClick={() => changeLanguage("am")}>
          Am
        </a>
        <h1 className="title is-4">{t("regester")}</h1>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Text input"
              {...register("name", { required: true })}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Username</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input is-success"
              type="text"
              placeholder="Text input"
              {...register("username", { required: true })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
            </span>
            <span className="icon is-small is-right">
              <i className="fas fa-check"></i>
            </span>
          </div>
          <p className="help is-success">This username is available</p>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={errors.email ? "input is-danger" : "input"}
              type="email"
              placeholder="Email input"
              {...register("email", { required: true })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
            <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
          </div>
          {errors.email && (
            <p className="help is-danger">This email is invalid</p>
          )}
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input"
              type="password"
              placeholder="Text input"
              {...register("password", {
                required: true,
                minLength: 6,
                maxLength: 25,
              })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-key"></i>
            </span>
            <span className="icon is-small is-right">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          <p className="help is-danger">This password is not strong</p>
        </div>

        <div className="field">
          <label className="label">Organization</label>
          <div className="control">
            <div className="select">
              <select {...register("org", { required: true })}>
                <option>Select Org</option>
                <option>EELPA</option>
                <option>WaSH</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" /> I agree to the{" "}
              <a onClick={toggleModal}>terms and conditions</a>
            </label>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <input className="button is-link" type="submit" value="Submit" />
          </div>
          <div className="control">
            <button className="button is-link is-light">Cancel</button>
          </div>
        </div>

        <div className="field">
          Already a member ? <a onClick={() => toggleLoginForm()}>Login here</a>
        </div>
      </form>
    </>
  );
};

const Login = ({ toggleLoginForm, changeLanguage }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit(loginUser)} className="field box">
      <h1 className="title is-4">{t("login")}</h1>

      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input
            class="input"
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
          <span class="icon is-small is-right">
            <i class="fas fa-check"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input
            class="input"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 25,
            })}
          />
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control">
          <input class="button is-success" type="submit" value="submit" />
        </p>
      </div>
      <div className="field">
        Not Regestered ? <a onClick={toggleLoginForm}>Regester here</a>
      </div>
    </form>
  );
};

export default App;
