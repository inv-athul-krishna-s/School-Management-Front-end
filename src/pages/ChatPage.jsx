import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Divider, TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // for fetching chat ID

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const wsRef = useRef(null); // store WebSocket so it doesn't trigger rerenders

  useEffect(() => {
    // Step 1: Get chat ID dynamically
    const fetchChatId = async () => {
      const res = await api.get("/chats/");
      if (res.data.length > 0) {
        // For now, pick the first chat
        setChatId(res.data[0].id);
      }
    };
    fetchChatId();
  }, []);

  useEffect(() => {
    if (!chatId) return;

    const token = localStorage.getItem("token");
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${token}`);
    wsRef.current = socket;

    socket.onopen = () => console.log("✅ Connected to chat");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    socket.onclose = () => console.log("❌ Disconnected from chat");

    return () => {
      socket.close();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && input.trim()) {
      wsRef.current.send(JSON.stringify({ content: input }));
      setInput("");
    }
  };

  return (
    <Box>
      <Typography variant="h5">Chat</Typography>
      <Divider />
      <Box sx={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", p: 1, mb: 2 }}>
        {messages.map((msg, i) => (
          <Typography key={i} sx={{ my: 1 }}>
            <strong>{msg.sender}:</strong> {msg.content}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
