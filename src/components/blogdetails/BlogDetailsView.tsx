import { useEffect, useState } from "react";
import { BlogData } from "../../common/blog";
import styles from "./BlogDetailsView.module.css";
import Map from "./Map";

const BlogDetailsView = (props: BlogData) => {
  const { image_url, title, content, lat, long } = props ?? {};
  const [coord, setCoord] = useState({ lat: "0", lng: "0" });
  useEffect(() => {}, []);

  const areCoordValid =
    !isNaN(parseFloat(coord.lat)) && !isNaN(parseFloat(coord.lng));
  return (
    <>
      <div className={styles.blogdetailsviewMain}>
        <p className={styles.blogdetailsviewTile}>{title}</p>
        <img src={image_url} alt="" height={"500px"} width={"800px"} />
        <p style={{ width: "800px" }}>{content}</p>
        {areCoordValid && (
          <div>
            <Map
              lat={parseFloat(coord.lat)}
              lng={parseFloat(coord.lng)}
              onChangePos={({ lat, lng }: { lat: number; lng: number }) => {
                setCoord({ lat: lat.toString(), lng: lng.toString() });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetailsView;
