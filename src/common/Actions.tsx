import { ReactNode } from "react";
import styles from "./Actions.module.css";

export type ActionsProps = {
  classMain: string;
  children: ReactNode;
  show: boolean;
};

const Actions = ({ classMain = "", children, show = false }: ActionsProps) => {
  return show ? (
    <div className={`${styles.actionsMain} ${classMain}`}> {children}</div>
  ) : null;
};

export default Actions;
