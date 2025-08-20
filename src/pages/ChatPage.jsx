import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const ChatPage = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load teacher's students (only once)
  useEffect(() => {
    if (user?.role !== "teacher") return;
    const fetchStudents = async () => {
      try {
        const res = await api.get("/students/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();
  }, [user, token]);

  // 🔹 Load existing chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chatList = Array.isArray(res.data.results) ? res.data.results : [];
        setChats(chatList);

        // Auto-select chat for student (only one chat with teacher)
        if (user?.role === "student" && chatList.length > 0) {
          const firstChat = chatList[0];
          setChatId(firstChat.id);
          fetchMessages(firstChat.id);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChats();
  }, [user, token]);

  // 🔹 Fetch messages for a chat
  const fetchMessages = async (chat_id) => {
    try {
      const res = await api.get(`/chats/${chat_id}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setMessages([]);
    }
  };

  // 🔹 WebSocket setup
  useEffect(() => {
    if (!token || !chatId) return;

    const url = `ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${token}`;
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => console.log("WS Connected");
    socket.onclose = () => console.log("WS Closed");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg = {
          id: data.id ?? Date.now(),
          chat: data.chat ?? chatId,
          content: data.content ?? "",
          sender_id: data.sender_id ?? data.sender?.id,
          sender_username: data.sender_username ?? data.sender?.username,
          timestamp: data.timestamp ?? new Date().toISOString(),
        };
        setMessages((prev) => [...prev, msg]);
      } catch (err) {
        console.error("WS Parse error:", err, event.data);
      }
    };

    return () => socket.close();
  }, [chatId, token]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && input.trim()) {
      const payload = { content: input.trim() };
      if (user?.role === "teacher") payload.chat_id = chatId;
      wsRef.current.send(JSON.stringify(payload));
      setInput("");
    }
  };

  // 🔹 Teacher opens chat with student
  const openChatWithStudent = async (student) => {
    try {
      let chat = chats.find((c) =>
        c.participants_detail.some((p) => p.id === student.user.id)
      );

      if (!chat) {
        const res = await api.post(
          "/chats/",
          { participants: [student.user.id] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        chat = res.data;
        setChats((prev) => [...prev, chat]);
      }

      setChatId(chat.id);
      fetchMessages(chat.id);
    } catch (err) {
      console.error("Error opening chat:", err.response?.data || err);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "85vh", bgcolor: "#f0f2f5" }}>
      {/* Sidebar: only for teachers */}
      {user?.role === "teacher" && (
        <Paper
          elevation={3}
          sx={{ width: 280, borderRight: "1px solid #ddd", overflowY: "auto" }}
        >
          <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
            My Students
          </Typography>
          <List>
            {students.map((stu) => (
              <ListItem
                key={stu.id}
                disablePadding
                selected={
                  chatId &&
                  chats.find((c) =>
                    c.participants_detail.some((p) => p.id === stu.user.id)
                  )?.id === chatId
                }
              >
                <ListItemButton onClick={() => openChatWithStudent(stu)}>
                  <Avatar sx={{ mr: 2 }}>
                    {stu.user.first_name?.[0]?.toUpperCase() ||
                      stu.user.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={`${stu.user.first_name} ${stu.user.last_name}`}
                    secondary="Click to chat"
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Chat Window */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        {/* 🔹 Chat Header */}
{chatId && (
  <Box
    sx={{
      p: 2,
      borderBottom: "1px solid #ddd",
      bgcolor: "white",
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    {(() => {
      const currentChat = chats.find((c) => c.id === chatId);
      const otherUser = currentChat?.participants_detail?.find(
        (p) => p.id !== user?.id
      );

      // Safely build the display name
      const displayName =
        otherUser?.first_name || otherUser?.last_name
          ? `${otherUser?.first_name || ""} ${otherUser?.last_name || ""}`.trim()
          : otherUser?.username || "Unknown";

      return (
        <>
          <Avatar>
            {displayName[0]?.toUpperCase() || "?"}
          </Avatar>
          <Typography variant="h6">{displayName}</Typography>
        </>
      );
    })()}
  </Box>
)}

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {chatId ? (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    bgcolor: isMe
                      ? user.role === "teacher"
                        ? "#E3F2FD"
                        : "#DCF8C6"
                      : "#FFFFFF",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "65%",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right", color: "gray", mt: 0.5 }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body1" sx={{ color: "gray", textAlign: "center", mt: 4 }}>
              {user?.role === "teacher"
                ? "Select a student to start chatting"
                : "Waiting for teacher..."}
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        {chatId && (
          <Box sx={{ p: 2, display: "flex", gap: 1, bgcolor: "white", borderTop: "1px solid #ddd" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <IconButton color="primary" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
