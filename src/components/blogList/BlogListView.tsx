import { useNavigate } from "react-router-dom";

import { BlogData } from "../../common/blog";
import ListItem from "./ListItem";
import styles from "./BlogListView.module.css";
type BlogListViewProps = {
  blogs: BlogData[];
};

//TODO: Default image
const BlogListView = ({ blogs }: BlogListViewProps) => {
  const navigate = useNavigate();
  const handleClick = (id: string, action: string) => {
    if (action !== "remove") navigate(`/details/${id}/${action}`);
  };
  if (!blogs || blogs.length <= 0) return <h3>No data Found</h3>;
  return (
    <div className={styles.blogListViewMain}>
      <div className={styles.blogListViewTitle}>BLOGS LIST</div>
      <div className={styles.blogListViewContent}>
        {blogs?.map((blog) => {
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
      </div>
    </div>
  );
};

export default BlogListView;
