import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BlogData } from "../common/blog";

import ListItem from "../components/blogList/ListItem";
import { useEffect, useState } from "react";
import config from "../common/config.json";
import UserFeedback, { UserFeedbackTypes } from "../common/UserFeedback";
import Actions from "../common/Actions";
import { handleError } from "../common/utils";

import styles from "../components/blogList/BlogListView.module.css";
import buttonStyles from "../common/styles/Button.module.css";

type BlogState = {
  loading: boolean;
  error: Error | null;
  results: BlogData[] | null;
};

const DEFAULT_STATE = {
  loading: false,
  error: null,
  results: null,
};

const OPERATION_FEEDBACK_DEFAULT = {
  type: UserFeedbackTypes.SUCCESS,
  message: "",
};

//TODO: Default image
const BlogsList = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<BlogState>(DEFAULT_STATE);
  const [queryState, setQueryState] = useState("LOADING");
  const [queryFeedback, setQueryFeedback] = useState(
    OPERATION_FEEDBACK_DEFAULT
  );

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await axios.get(`${config.END_POINT}/api/v1/posts`);
        return response?.data ?? [];
      } catch (error) {
        throw error;
      }
    }

    setState((prevState) => ({ ...prevState, loading: true }));
    getPosts()
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

  useEffect(() => {
    let newQueryState = "LOADING";
    if (!!state?.results && state.results.length > 0) newQueryState = "SUCESS";
    if (!!state?.results && state.results.length <= 0) newQueryState = "NODATA";
    if (state?.loading) newQueryState = "LOADING";
    if (!!state?.error) newQueryState = "ERROR";
    setQueryState(newQueryState);
  }, [state]);

  const handleClick = (id: string, action: string) => {
    if (action !== "remove") navigate(`/details/${id}/${action}`);
    else {
      axios
        .delete(`${config.END_POINT}/api/v1/posts/${id}`)
        .then((response) => {
          setQueryFeedback({
            type: UserFeedbackTypes.SUCCESS,
            message: "Post removed successfully!",
          });
          setTimeout(() => {
            setQueryFeedback(OPERATION_FEEDBACK_DEFAULT);
            const updatedResults = (state.results as any)?.filter(
              (blog: BlogData) => blog.id !== id
            );
            setState((prevState) => ({
              ...prevState,
              results: updatedResults,
            }));
          }, 2000);
        })
        .catch((err) => {
          setQueryFeedback({
            type: UserFeedbackTypes.ERROR,
            message: "Operation failed!",
          });
          handleError(err);
        });
    }
  };

  return (
    <>
      <div className={styles.blogListViewMain}>
        <button
          className={`${styles.blogListViewAddButton} ${buttonStyles.btnPrimary}`}
          style={{ padding: "15px", border: "1px solid", fontSize: "1.1em" }}
          onClick={(e) => navigate("/details/0/edit")}
        >
          + New Post
        </button>
        <div
          className={styles.blogListViewTitle}
          style={{ marginBottom: "20px", color: "rgb(112 125 207)" }}
        >
          BLOGS LIST
        </div>
        <div className={styles.blogListViewContent}>
          {queryState === "SUCESS" &&
            (state?.results as BlogData[] | null)?.map((blog: BlogData) => {
              return (
                <ListItem
                  key={blog.id}
                  imageSrc={blog?.image_url ?? ""}
                  title={blog?.title}
                  onClick={(action) => {
                    handleClick(blog.id, action);
                  }}
                />
              );
            })}

          {queryState === "NODATA" && (
            <UserFeedback
              type={UserFeedbackTypes.INFO}
              message={"NO DATA FOUND"}
            />
          )}
          {queryState === "LOADING" && (
            <UserFeedback
              type={UserFeedbackTypes.INFO}
              message={"Loading...."}
            />
          )}
          {queryState === "ERROR" && (
            <UserFeedback
              type={UserFeedbackTypes.ERROR}
              message={"An error has ocurred. Try again later"}
            />
          )}
        </div>
      </div>
      <Actions
        classMain={styles.blogListViewActionsFeedback}
        show={queryFeedback.message !== ""}
      >
        <UserFeedback
          type={queryFeedback.type}
          message={queryFeedback.message}
        />
      </Actions>
    </>
  );
};

export default BlogsList;
