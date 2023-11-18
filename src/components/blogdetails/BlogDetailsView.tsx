import { Action } from "@remix-run/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Actions from "../../common/Actions";
import { BlogData } from "../../common/blog";
import { handleError } from "../../common/utils";
import styles from "./BlogDetailsView.module.css";
import Map from "./Map";
import config from "../../common/config.json";
import { useNavigate } from "react-router-dom";
import UserFeedback, { UserFeedbackTypes } from "../../common/UserFeedback";
import buttonStyles from "../../common/styles/Button.module.css";

export type BlogDetailsViewProps = {
  id: string;
};

const DEFAULT_STATE = {
  loading: false,
  error: null,
  results: null,
};

const BlogDetailsView = ({ id, ...props }: BlogDetailsViewProps) => {
  const navigate = useNavigate();
  const [coord, setCoord] = useState({ lat: "37.7749", lng: "-122.4194" });
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
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
          loading: false,
          results: data,
          error: null,
        }));
      })
      .catch((err) => {
        handleError(err);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          results: null,
          error: err,
        }));
      });
  }, []);

  const handleClick = (id: string, action: string) => {
    if (action !== "remove") navigate(`/details/${id}/${action}`);
  };

  let currenState = "LOADING";
  if (!!state?.results) currenState = "SUCESS";
  if (state?.loading) currenState = "LOADING";
  if (!!state?.error) currenState = "ERROR";

  const areCoordValid =
    !isNaN(parseFloat(coord.lat)) && !isNaN(parseFloat(coord.lng));

  console.log("stateeeeeeeeee", state, currenState);
  return (
    <>
      {currenState === "SUCESS" && (
        <div className={styles.blogdetailsviewMain}>
          <p className={styles.blogdetailsviewTile}>
            {(state?.results as BlogData | null)?.title}
          </p>
          <img
            src={(state?.results as BlogData | null)?.image_url}
            alt=""
            height={"500px"}
            width={"800px"}
          />
          <p style={{ width: "800px" }}>
            {(state?.results as BlogData | null)?.content}
          </p>
          {areCoordValid && (
            <div>
              <Map
                lat={parseFloat(
                  (state?.results as BlogData | null)?.lat ?? "0"
                )}
                lng={parseFloat(
                  (state?.results as BlogData | null)?.long ?? "0"
                )}
                onChangePos={() => {}}
              />
            </div>
          )}
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
        <button
          className={buttonStyles.btnSecondary}
          onClick={(e) => navigate("/")}
        >
          Back
        </button>
        <button
          className={buttonStyles.btnPrimary}
          onClick={(e) => navigate(`/details/${id}/edit`)}
        >
          Edit
        </button>
      </Actions>
    </>
  );
};

export default BlogDetailsView;
