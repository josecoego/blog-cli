import styles from "./ListItem.module.css";
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
        src={imageSrc}
        alt="Image"
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
        style={{}}
      >
        <button
          className={styles.blogListViewContentItemButton}
          onClick={() => onClick("remove")}
        >
          Remove
        </button>
        <button onClick={() => onClick("edit")}>Edit</button>
      </div>
    </div>
  );
};

export default ListItem;
