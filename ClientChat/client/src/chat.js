import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./index.css";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:8080", { transports: ["websocket"] });
socket.on("connect", () => console.log(" IO - Conectado ao Server"));
const meuId = uuidv4();

export default function Chat() {
  const [message, updateMessage] = useState("");
  const [messages, updateMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (newMessage) =>
      updateMessages([...messages, newMessage]);
    socket.on("message", handleNewMessage);
    return () => socket.off("message", handleNewMessage);
  }, [messages]);

  const handleInputChange = (event) => {
    updateMessage(event.target.value);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit("message", { id: meuId, message });
      updateMessage("");
    }
  };
  return (
    <main className="container">
      <ul className="list">
        {messages.map((m, index) => (
          <li
            className={`list__item list__item--${
              m.id === meuId ? "mine" : "other"
            }`}
            key={m.index}
          >
            <span
              className={`message message--${
                m.id === meuId ? "mine" : "other"
              }`}
            >
              {m.message}
            </span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          value={message}
          className="form__field"
          placeholder="Digite uma mensagem"
          onChange={handleInputChange}
        ></input>
      </form>
    </main>
  );
}
