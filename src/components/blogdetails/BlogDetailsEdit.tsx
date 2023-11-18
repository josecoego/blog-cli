import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import config from "../../common/config.json";

import Actions from "../../common/Actions";
import { handleError } from "../../common/utils";
import Map from "./Map";
import UserFeedback, { UserFeedbackTypes } from "../../common/UserFeedback";

import styles from "./BlogDetails.module.css";
import buttonStyles from "../../common/styles/Button.module.css";

export type BlogDetailsEditProps = {
  id: string;
};

const DEFAULT_STATE = {
  image_url: "",
  title: "",
  content: "",
  lat: "37.7749",
  long: "-122.4194",
  loading: false,
  error: null,
};

const DEFAULT_ERROR_STATE = {
  image_url: "",
  title: "",
  content: "",
  lat: "",
  long: "",
};

const DEFAULT_QUERY_FEEDBACK = {
  type: UserFeedbackTypes.SUCCESS,
  message: "",
};

const BlogDetailsEdit = ({ id }: BlogDetailsEditProps) => {
  const navigate = useNavigate();
  const [state, setState] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState(DEFAULT_ERROR_STATE);
  const [queryFeedback, setQueryFeedback] = useState(DEFAULT_QUERY_FEEDBACK);
  const [queryState, setQueryState] = useState("SUCCESS");

  useEffect(() => {
    if (id === "0") return;
    async function getPost() {
      try {
        const response = await axios.get(
          `${config.END_POINT}/api/v1/posts/${id}`
        );
        return response?.data ?? [];
      } catch (error) {
        throw error;
      }
    }

    setState((prevState) => ({ ...prevState, loading: true }));
    getPost()
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          ...data,
          loading: false,
          error: null,
        }));
      })
      .catch((err) => {
        handleError(err);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: err,
        }));
      });
  }, [id]);

  useEffect(() => {
    let newQueryState = "SUCCESS";
    if (state?.loading) newQueryState = "LOADING";
    if (!!state?.error) newQueryState = "ERROR";
    setQueryState(newQueryState);
  }, [state]);

  const handleClickSave = () => {
    //validate input data (required fields...etc)
    setErrors(DEFAULT_ERROR_STATE);
    let isValid = true;
    if (!state.title) {
      isValid = false;
      setErrors((prevErr) => ({
        ...prevErr,
        title: "Title is required",
      }));
    }
    if (!state.content) {
      isValid = false;
      setErrors((prevErr) => ({
        ...prevErr,
        content: "Content is required",
      }));
    }
    if (isNaN(parseFloat(state.lat))) {
      isValid = false;
      setErrors((prevErr) => ({
        ...prevErr,
        lat: "Latitude is not valid",
      }));
    }
    if (isNaN(parseFloat(state.long))) {
      isValid = false;
      setErrors((prevErr) => ({
        ...prevErr,
        long: "Longitude is not valid",
      }));
    }

    if (!isValid) return;

    const { loading, error, ...stateToSave } = state;
    let httpMethod = "post";
    let endPoint = "";
    if (id === "0") {
      //Create Mode
      httpMethod = "post";
      endPoint = `${config.END_POINT}/api/v1/posts`;
    } else {
      //Edit Mode
      httpMethod = "put";
      endPoint = `${config.END_POINT}/api/v1/posts/${id}`;
    }
    (axios as any)
      [httpMethod](endPoint, stateToSave)
      .then(() => {
        setQueryFeedback({
          type: UserFeedbackTypes.SUCCESS,
          message: "Operation successful!",
        });
        setTimeout(() => {
          setQueryFeedback(DEFAULT_QUERY_FEEDBACK);
          navigate("/");
        }, 2000);
      })
      .catch((err: Error) => {
        setQueryFeedback({
          type: UserFeedbackTypes.ERROR,
          message: "Operation failed!",
        });
        handleError(err);
      });
  };

  return (
    <>
      {queryState === "SUCCESS" && (
        <div className={styles.blogdetailsviewMain}>
          <div>
            <input
              type="text"
              placeholder="Insert title (*)"
              className={styles.blogdetailsviewTile}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  title: e.target.value,
                }))
              }
              value={state?.title}
            />
            {errors.title !== "" && (
              <UserFeedback
                type={UserFeedbackTypes.ERROR}
                message={errors.title}
              />
            )}
          </div>
          <div className={styles.blogDetailsEditImg}>
            <input
              type="text"
              placeholder="Insert image url"
              className={styles.blogdetailsviewTile}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  image_url: e.target.value,
                }))
              }
              value={state.image_url}
            />
            <img
              src={state.image_url}
              alt=""
              height={"500px"}
              width={"800px"}
            />
          </div>
          <div style={{ marginBottom: "30px" }}>
            <textarea
              placeholder="Insert description (*)"
              style={{ width: "800px" }}
              rows={7}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  content: e.target.value,
                }))
              }
              value={state.content}
            />
            {errors.content !== "" && (
              <UserFeedback
                type={UserFeedbackTypes.ERROR}
                message={errors.content}
              />
            )}
          </div>
          <div>
            <div
              style={{
                border: "1px solid #9ea6d7",
                left: "0px",
                borderRadius: "5px",
                padding: "3px",
              }}
            >
              <label style={{ color: "#9ea6d7", fontWeight: "bold" }}>
                Click into the map to get coordinates:
              </label>
              <br />
              <input
                style={{ fontSize: "0.8em" }}
                disabled={true}
                type="text"
                placeholder="latitude"
                className={styles.blogdetailsviewTile}
                value={state.lat}
              />
              {errors.lat !== "" && (
                <UserFeedback
                  type={UserFeedbackTypes.ERROR}
                  message={errors.lat}
                />
              )}
              <br />
              <input
                style={{ fontSize: "0.8em" }}
                disabled={true}
                type="text"
                placeholder="longitude"
                className={styles.blogdetailsviewTile}
                value={state.long}
              />
              {errors.long !== "" && (
                <UserFeedback
                  type={UserFeedbackTypes.ERROR}
                  message={errors.long}
                />
              )}
            </div>
            <Map
              styles={{
                position: "relative",
                height: "400px",
                width: "800px",
                top: "0px",
                left: "-260px",
              }}
              lat={parseFloat(state.lat)}
              lng={parseFloat(state.long)}
              onChangePos={({ lat, lng }: { lat: number; lng: number }) => {
                setState((prevState) => ({
                  ...prevState,
                  lat: lat.toString(),
                  long: lng.toString(),
                }));
              }}
            />
          </div>
        </div>
      )}

      {queryState === "LOADING" && (
        <UserFeedback type={UserFeedbackTypes.INFO} message={"Loading...."} />
      )}
      {queryState === "ERROR" && (
        <UserFeedback
          type={UserFeedbackTypes.ERROR}
          message={"An error has ocurred. Try again later"}
        />
      )}

      <Actions classMain={styles.blogDetailsViewDefaultActions} show={true}>
        {queryFeedback.message !== "" && (
          <div
            style={{
              flexBasis: "100%",
              textAlign: "center",
              padding: "5px",
            }}
          >
            <UserFeedback
              type={queryFeedback.type}
              message={queryFeedback.message}
            />
          </div>
        )}
        <button
          className={buttonStyles.btnSecondary}
          onClick={(e) => navigate("/")}
        >
          Cancel/Back
        </button>
        <button
          className={buttonStyles.btnPrimary}
          onClick={(e) => handleClickSave()}
        >
          Save
        </button>
      </Actions>
    </>
  );
};

export default BlogDetailsEdit;
