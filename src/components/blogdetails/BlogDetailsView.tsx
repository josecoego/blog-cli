import { BlogData } from "../../common/blog";
import styles from "./BlogDetailsView.module.css";
import Map from "./Map";

const BlogDetailsView = (props: BlogData) => {
  const { image_url, title, content } = props ?? {};
  return (
    <>
      <div className={styles.blogdetailsviewMain}>
        <p className={styles.blogdetailsviewTile}>{title}</p>
        <img src={image_url} alt="" height={"500px"} width={"800px"} />
        <p style={{ width: "800px" }}>{content}</p>
        <div>
          <Map name={"Jose"} />
        </div>
      </div>
    </>
  );
};

export default BlogDetailsView;
