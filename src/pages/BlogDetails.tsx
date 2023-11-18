import { useParams } from "react-router-dom";
import BlogDetailsEdit from "../components/blogdetails/BlogDetailsEdit";
import BlogDetailsView from "../components/blogdetails/BlogDetailsView";

const BlogDetails = () => {
  const { id, action } = useParams();

  if (action === "view") {
    return <BlogDetailsView id={id ?? "0"} />;
  }
  if (action === "edit") {
    return <BlogDetailsEdit id={id ?? "0"} />;
  }
  return null;
};

export default BlogDetails;
