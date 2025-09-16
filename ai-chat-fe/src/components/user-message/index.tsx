import React from "react";
import { CopyOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

interface IProps {
  content: string;
}
const UserMessage = (props: IProps) => {
  return (
    <div className={styles.userMessage}>
      <div className={styles.message}>
        <div className={styles.content}>{props.content}</div>
      </div>
      <div className={styles.btns}>
        <div className={styles.btn}>
            <CopyOutlined />
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
