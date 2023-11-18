import styles from "./UserFeedback.module.css";
export enum UserFeedbackTypes {
  INFO = "info",
  SUCCESS = "success",
  ERROR = "error",
}

export type UserFeedbackProps = {
  type: UserFeedbackTypes;
  message: string;
  customClass?: string;
};
const UserFeedback = ({
  type,
  message,
  customClass = "",
}: UserFeedbackProps) => {
  let mainClass = "";
  switch (type) {
    case UserFeedbackTypes.INFO:
      mainClass = styles.userfeedbackInfo;
      break;
    case UserFeedbackTypes.SUCCESS:
      mainClass = styles.userfeedbackSuccess;
      break;
    case UserFeedbackTypes.ERROR:
      mainClass = styles.userfeedbackError;
      break;
    default:
      mainClass = styles.userfeedbackInfo;
  }
  return <div className={`${mainClass} ${customClass}`}>{message}</div>;
};

export default UserFeedback;
