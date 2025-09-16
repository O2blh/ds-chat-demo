import React from "react";
import ChatInputBox from "../../components/chat-input-box";
import { useNavigate } from "react-router-dom";
import { generateRandomId } from "../../utils/helper";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="main">
        <h1>今天有什么可以帮到你？</h1>
        <ChatInputBox
          onSubmit={(message: string) =>
            navigate(`/chats/${generateRandomId()}?message=${message}`)
          }
        />
      </div>
    </div>
  );
};

export default Home;
