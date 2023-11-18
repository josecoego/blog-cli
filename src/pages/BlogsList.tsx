import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";

import { BlogData } from "../common/blog";
import ListItem from "../components/blogList/ListItem";
import styles from "../components/blogList/BlogListView.module.css";
import { useEffect, useState } from "react";
import config from "../common/config.json";
import { handleError } from "../common/utils";
import UserFeedback, { UserFeedbackTypes } from "../common/UserFeedback";
import Actions from "../common/Actions";
import buttonStyles from "../common/styles/Button.module.css";

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
  const blogs: any = [];
  const navigate = useNavigate();
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    results: BlogData[] | null;
  }>(DEFAULT_STATE);
  const [operationFeedback, setOperationFeedback] = useState(
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

  const handleClick = (id: string, action: string) => {
    if (action !== "remove") navigate(`/details/${id}/${action}`);
    else {
      axios
        .delete(`${config.END_POINT}/api/v1/posts/${id}`)
        .then((response) => {
          setOperationFeedback({
            type: UserFeedbackTypes.SUCCESS,
            message: "Post removed successfully!",
          });
          setTimeout(() => {
            setOperationFeedback(OPERATION_FEEDBACK_DEFAULT);
            const updatedResults = (state.results as any)?.filter(
              (blog: BlogData) => blog.id !== id
            );
            setState((prevState) => ({
              ...prevState,
              results: updatedResults,
            }));
          }, 3000);
          /* navigate(`/details/${response.data.id}/view`); */
        })
        .catch((err) => {
          setOperationFeedback({
            type: UserFeedbackTypes.ERROR,
            message: "Operation failed!",
          });
          handleError(err);
        });
    }
  };

  let currenState = "LOADING";
  if (!!state?.results && (state.results as BlogData[]).length > 0)
    currenState = "SUCESS";
  if (!!state?.results && (state.results as BlogData[]).length <= 0)
    currenState = "NODATA";
  if (state?.loading) currenState = "LOADING";
  if (!!state?.error) currenState = "ERROR";

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
          style={{ marginBottom: "20px" }}
        >
          BLOGS LIST
        </div>
        <div className={styles.blogListViewContent}>
          {currenState === "SUCESS" &&
            (state?.results as BlogData[] | null)?.map((blog: BlogData) => {
              return (
                <ListItem
                  imageSrc={blog?.image_url ?? ""}
                  title={blog?.title}
                  onClick={(action) => {
                    handleClick(blog.id, action);
                  }}
                />
              );
            })}

          {currenState === "NODATA" && (
            <UserFeedback
              type={UserFeedbackTypes.INFO}
              message={"NO DATA FOUND"}
            />
          )}
          {currenState === "LOADING" && (
            <UserFeedback
              type={UserFeedbackTypes.INFO}
              message={"Loading...."}
            />
          )}
          {currenState === "ERROR" && (
            <UserFeedback
              type={UserFeedbackTypes.ERROR}
              message={"An error has ocurred. Try again later"}
            />
          )}
        </div>
      </div>
      <Actions
        classMain={styles.blogListViewActionsFeedback}
        show={operationFeedback.message !== ""}
      >
        <UserFeedback
          type={operationFeedback.type}
          message={operationFeedback.message}
        />
      </Actions>
    </>
  );
};

export default BlogsList;
