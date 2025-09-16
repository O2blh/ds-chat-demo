import React, { useRef, useState } from "react";
import ChatInputBox from "../../components/chat-input-box";
import styles from "./index.module.scss";
import DsMarkdown from "ds-markdown";
import UserMessage from "../../components/user-message";

interface ChatMessage {
  content: string;
  role: string;
}
const Chats = () => {
  const [isOutput, setIsOutput] = useState(false);
  const abortControllerRes = useRef<AbortController | null>(null);
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const handleSend = async (messaage: string) => {
    setIsOutput(true);
    setMessageList((prev) => [
      ...prev,
      {
        content: messaage,
        role: "user",
      },
    ]);
    try {
      if (abortControllerRes.current) {
        abortControllerRes.current.abort();
      }
      abortControllerRes.current = new AbortController();
      const abortSignal = abortControllerRes.current.signal;

      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messaage,
        }),

        signal: abortSignal,
      });
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        setMessageList((prev) => [
          ...prev,
          {
            content: buffer,
            role: "assistant",
          },
        ]);
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 将二进制数据块解码为文本并添加到缓冲区
            buffer += decoder.decode(value, { stream: true });

            setMessageList((prev) => [
              ...prev.slice(0, -1),
              {
                content: buffer,
                role: "assistant",
              },
            ]);
            // 滚动到最底部
            document
              .querySelector(".chat")
              ?.scrollTo(0, document.body.scrollHeight);
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setIsOutput(false);
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.main}>
        <div className={styles.title}>
          <div className={styles.text}>构建多模型AI对话前端界面实现</div>
        </div>
        <div className={styles.content}>
          {/* 内容流式输出 */}
          {messageList.map((t) => {
            if (t.role === "assistant") {
              return (
                <DsMarkdown interval={20} answerType="answer">
                  {t.content}
                </DsMarkdown>
              );
            } else {
              return <UserMessage content={t.content} />;
            }
          })}

          <div className={styles.chatInput}>
            <ChatInputBox
              onSubmit={handleSend}
              loading={isOutput}
              onPause={() => abortControllerRes.current?.abort()}
            />
            <div className={styles.tips}>内容由 AI 生成，请仔细甄别</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
