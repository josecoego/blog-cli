import { Action } from "@remix-run/router";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Actions from "../../common/Actions";
import { BlogData } from "../../common/blog";
import { handleError } from "../../common/utils";
import styles from "./BlogDetailsView.module.css";
import Map from "./Map";
import config from "../../common/config.json";
import UserFeedback, { UserFeedbackTypes } from "../../common/UserFeedback";

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

const BlogDetailsEdit = ({ id }: BlogDetailsEditProps) => {
  /*  const [coord, setCoord] = useState({ lat: "37.7749", lng: "-122.4194" }); */
  const navigate = useNavigate();
  const [state, setState] = useState(DEFAULT_STATE);
  const [errors, setErrors] = useState(DEFAULT_ERROR_STATE);
  const [operationFeedback, setOperationFeedback] = useState("");
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
        console.log("dataaaaaaa", data);
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
  }, []);

  const handleClickSave = () => {
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
    if (id === "0") {
      axios
        .post(`${config.END_POINT}/api/v1/posts`, stateToSave)
        .then((response) => {
          setOperationFeedback("Operation successful!");
          setTimeout(() => {
            setOperationFeedback("");
            navigate("/");
          }, 3000);
          /* navigate(`/details/${response.data.id}/view`); */
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      axios
        .put(`${config.END_POINT}/api/v1/posts/${id}`, stateToSave)
        .then((response) => {
          setOperationFeedback("Operation successful!");
          setTimeout(() => {
            setOperationFeedback("");
            navigate("/");
          }, 3000);
          /* navigate(`/details/${response.data.id}/view`); */
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };
  /* const areCoordValid =
    !isNaN(parseFloat(coord.lat)) && !isNaN(parseFloat(coord.lng)); */
  let currenState = "SUCESS";
  if (state?.loading) currenState = "LOADING";
  if (!!state?.error) currenState = "ERROR";

  return (
    <>
      {currenState === "SUCESS" && (
        <div className={styles.blogdetailsviewMain}>
          <input
            type="text"
            placeholder="Insert title (*)"
            className={styles.blogdetailsviewTile}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, title: e.target.value }))
            }
            value={state?.title}
          />
          {errors.title !== "" && (
            <UserFeedback
              type={UserFeedbackTypes.ERROR}
              message={errors.title}
            />
          )}
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
          <div>
            <textarea
              placeholder="Insert description (*)"
              style={{ width: "800px", marginBottom: "30px" }}
              rows={7}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  content: e.target.value,
                }))
              }
              value={state.content}
            ></textarea>
          </div>
          {errors.content !== "" && (
            <UserFeedback
              type={UserFeedbackTypes.ERROR}
              message={errors.content}
            />
          )}
          <div>
            <label>Click into the map to get coordinates:</label>
            <br />
            <input
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
            <Map
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

      {currenState === "LOADING" && (
        <UserFeedback type={UserFeedbackTypes.INFO} message={"Loading...."} />
      )}
      {currenState === "ERROR" && (
        <UserFeedback
          type={UserFeedbackTypes.ERROR}
          message={"An error has ocurred. Try again later"}
        />
      )}

      <Actions classMain={styles.blogDetailsViewDefaultActions} show={true}>
        {operationFeedback !== "" && (
          <div
            style={{
              flexBasis: "100%",
              textAlign: "center",
              padding: "5px",
            }}
          >
            <UserFeedback
              type={UserFeedbackTypes.SUCCESS}
              message={operationFeedback}
            />
          </div>
        )}
        <button onClick={(e) => handleClickSave()}>Save</button>
        <button onClick={(e) => navigate("/")}>Cancel/Back</button>
      </Actions>
    </>
  );
};

export default BlogDetailsEdit;
