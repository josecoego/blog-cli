import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Actions from "../../common/Actions";
import { BlogData } from "../../common/blog";
import { handleError } from "../../common/utils";

import Map from "./Map";
import config from "../../common/config.json";
import UserFeedback, { UserFeedbackTypes } from "../../common/UserFeedback";

import buttonStyles from "../../common/styles/Button.module.css";
import styles from "./BlogDetailsView.module.css";

export type BlogDetailsViewProps = {
  id: string;
};

const DEFAULT_STATE = {
  loading: false,
  error: null,
  results: null,
};

const BlogDetailsView = ({ id }: BlogDetailsViewProps) => {
  const navigate = useNavigate();

  const [state, setState] = useState(DEFAULT_STATE);
  const [queryState, setQueryState] = useState("LOADING");

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
  }, [id]);

  useEffect(() => {
    let newQueryState = "LOADING";
    if (!!state?.results) newQueryState = "SUCESS";
    if (state?.loading) newQueryState = "LOADING";
    if (!!state?.error) newQueryState = "ERROR";
    setQueryState(newQueryState);
  }, [state]);

  return (
    <>
      {queryState === "SUCESS" && (
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

          <div>
            <Map
              lat={parseFloat((state?.results as BlogData | null)?.lat ?? "0")}
              lng={parseFloat((state?.results as BlogData | null)?.long ?? "0")}
              onChangePos={() => {}}
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
        <button
          className={buttonStyles.btnSecondary}
          onClick={(e) => navigate("/")}
        >
          Back
        </button>
        <button
          className={buttonStyles.btnPrimary}
          onClick={() => navigate(`/details/${id}/edit`)}
        >
          Edit
        </button>
      </Actions>
    </>
  );
};

export default BlogDetailsView;
