import React, { useState } from "react";
import styles from "./index.module.scss";
import { Button, Tooltip } from "antd";
import { ArrowUpOutlined, PauseOutlined } from "@ant-design/icons";

interface IProps {
  loading?: boolean;
  onSubmit?: (message: string) => void;
  onPause?: () => void;
}
const ChatInputBox = (props: IProps) => {
  const [text, setText] = useState("");
  const [isDeepThink, setIsDeepThink] = useState(false);

  const handleSend = async () => {
    props.onSubmit?.(text);
    setText("");
  };

  const handlePause = async () => {
    props.onPause?.();
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          rows={2}
          placeholder="给 DeepSeek 发送消息"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div
          className={styles.textBlock}
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      </div>
      <div className={styles.btns}>
        <Button
          onClick={() => setIsDeepThink(!isDeepThink)}
          style={{ borderRadius: 18 }}
          ghost={!isDeepThink}
          type="primary"
        >
          深度思考
        </Button>
        <div className={styles.btnRight}>
          <Tooltip title={!text ? "请输入你的问题" : ""} showArrow={false}>
            {props.loading ? (
              <Button
                shape="circle"
                icon={<PauseOutlined />}
                type="primary"
                onClick={handlePause}
              ></Button>
            ) : (
              <Button
                shape="circle"
                icon={<ArrowUpOutlined />}
                type="primary"
                disabled={!text}
                onClick={handleSend}
              ></Button>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
