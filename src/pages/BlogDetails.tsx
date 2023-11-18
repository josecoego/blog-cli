import { useParams } from "react-router-dom";
import BlogDetailsEdit from "../components/blogdetails/BlogDetailsEdit";
import BlogDetailsView from "../components/blogdetails/BlogDetailsView";

const BlogDetails = () => {
  const { id, action } = useParams();

  console.log("paramsssssssss", id, action);

  if (action === "view") {
    return <BlogDetailsView id={id ?? "0"} />;
  }
  if (action === "edit") {
    return (
      <div>
        <BlogDetailsEdit
          id={""}
          title={"Madrid"}
          content={
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu"
          }
          lat={""}
          long={""}
          image_url={
            "https://c2.staticflickr.com/2/1269/4670777817_d657cd9819_b.jpg"
          }
        />
      </div>
    );
  }
  return null;
};

export default BlogDetails;
