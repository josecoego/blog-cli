import { Action } from "@remix-run/router";
import { useEffect, useState } from "react";
import Actions from "../../common/Actions";
import { BlogData } from "../../common/blog";
import styles from "./BlogDetailsView.module.css";
import Map from "./Map";

const BlogDetailsEdit = (props: BlogData) => {
  const { image_url, title, content, lat, long } = props ?? {};
  const [coord, setCoord] = useState({ lat: "37.7749", lng: "-122.4194" });

  const areCoordValid =
    !isNaN(parseFloat(coord.lat)) && !isNaN(parseFloat(coord.lng));
  return (
    <>
      <div className={styles.blogdetailsviewMain}>
        <input
          type="text"
          placeholder="Insert title (*)"
          className={styles.blogdetailsviewTile}
          value={title}
        />
        <div className={styles.blogDetailsEditImg}>
          <input
            type="text"
            placeholder="Insert image url"
            className={styles.blogdetailsviewTile}
            value={
              "https://c2.staticflickr.com/2/1269/4670777817_d657cd9819_b.jpg"
            }
          />
          <img src={image_url} alt="" height={"500px"} width={"800px"} />
        </div>
        <textarea style={{ width: "800px", marginBottom: "30px" }} rows={7}>
          {content}
        </textarea>

        <div>
          <label>Insert lon/lat manually o click into the map:</label>
          <br />
          <input
            type="text"
            placeholder="Insert lat or click into the map"
            className={styles.blogdetailsviewTile}
            value={""}
          />
          <br />
          <input
            type="text"
            placeholder="Insert long or click into the map"
            className={styles.blogdetailsviewTile}
            value={""}
          />

          <Map
            lat={parseFloat(coord.lat)}
            lng={parseFloat(coord.lng)}
            onChangePos={({ lat, lng }: { lat: number; lng: number }) => {
              setCoord({ lat: lat.toString(), lng: lng.toString() });
            }}
          />
        </div>
      </div>

      <Actions classMain={styles.blogDetailsViewDefaultActions} show={true}>
        <button onClick={(e) => window.open("/")}>Save</button>
        <button>Cancel/Back</button>
      </Actions>
    </>
  );
};

export default BlogDetailsEdit;
