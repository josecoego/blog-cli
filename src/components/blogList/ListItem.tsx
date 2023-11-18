import styles from "./ListItem.module.css";
import buttonStyles from "../../common/styles/Button.module.css";
export type ListItemProps = {
  imageSrc: string;
  title: string;
  onClick: (action: string) => void;
};

const ListItem = ({ imageSrc, title, onClick }: ListItemProps) => {
  return (
    <div className={styles.blogListViewMain}>
      <img
        onClick={() => onClick("view")}
        style={{ borderRadius: "7px 7px 0px 0px" }}
        src={imageSrc}
        alt=""
        className={`${styles.blogListViewContentItem} ${styles.blogListViewContentItemImg}`}
      />

      <div
        className={`${styles.blogListViewContentItem} ${styles.blogListViewContentItemTitle}`}
        onClick={() => onClick("edit")}
      >
        {title}
      </div>
      <div
        className={`${styles.blogListViewContentItem} ${styles.blogListViewContentItemActions}`}
        style={{ borderRadius: "0px 0px 7px 7px" }}
      >
        <button
          className={`${styles.blogListViewContentItemButton} ${buttonStyles.btnSecondary}`}
          style={{ color: "#9ea6d7", textDecoration: "underline" }}
          onClick={() => onClick("remove")}
        >
          Remove
        </button>
        <button
          className={buttonStyles.btnPrimary}
          onClick={() => onClick("edit")}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ListItem;
