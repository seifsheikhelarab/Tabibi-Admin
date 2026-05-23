import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '../../lib/auth';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DoctorChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get doctor info from Better Auth session
  const { data: session, isPending } = authClient.useSession();
  const doctorId = session?.user?.id;
  const token = session?.session?.token;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isPending || !token || !doctorId) return;

    // Initialize socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register_doctor', doctorId);
    });

    socketRef.current.on('receive_message', (message) => {
      const chatId = activeChat?.id || activeChat?._id;
      if (chatId && (message.chatId === chatId)) {
        setMessages((prev) => [...prev, message]);
      } else {
        // Show alert for new message
        setNewMessageAlert(true);
        setTimeout(() => setNewMessageAlert(false), 3000);
      }
    });

    socketRef.current.on('new_message_notification', () => {
      fetchChats();
    });

    fetchChats();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, doctorId, isPending]);

  useEffect(() => {
    if (activeChat && socketRef.current) {
      const chatId = activeChat.id || activeChat._id;
      socketRef.current.emit('join_chat', chatId);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/doctor-chats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = async (chat) => {
    setActiveChat(chat);
    const chatId = chat.id || chat._id;
    socketRef.current?.emit('join_chat', chatId);

    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() && !image) return;
    if (!activeChat) return;

    setSending(true);
    const formData = new FormData();
    formData.append('chatId', activeChat.id || activeChat._id);
    formData.append('senderId', doctorId);
    formData.append('senderType', 'DOCTOR');
    formData.append('content', messageText);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMessageText('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const deleteConversation = async () => {
    if (!activeChat) return;
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const response = await fetch(`${SOCKET_URL}/api/chat/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatId: activeChat.id || activeChat._id })
      });
      const data = await response.json();
      if (data.success) {
        setActiveChat(null);
        setMessages([]);
        fetchChats();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPatientName = (chat) => {
    const user = chat.userFrom || chat.userData;
    return user?.name || 'Patient';
  };

  const getPatientImage = (chat) => {
    const user = chat.userFrom || chat.userData;
    return user?.image || '/default-avatar.png';
  };

  const getMessageSender = (msg) => msg.senderType === 'DOCTOR' || msg.senderType === 'doctor';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[80vh] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* New Message Alert */}
      <AnimatePresence>
        {newMessageAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-primary text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
          >
            New message received!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Patient Chats</h2>
          <p className="text-sm text-gray-500">Conversations with your patients</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 text-sm">No patient conversations yet</p>
              <p className="text-gray-400 text-xs mt-1">Messages from patients will appear here</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id || chat._id}
                onClick={() => openChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-50 ${
                  activeChat?.id === chat.id || activeChat?._id === chat._id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <img
                  src={getPatientImage(chat)}
                  alt={getPatientName(chat)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {getPatientName(chat)}
                  </h3>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50/30">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-400">Select a patient chat</h3>
              <p className="text-sm text-gray-300">Choose a conversation from the left to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
              <button
                onClick={() => setActiveChat(null)}
                className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <img
                src={getPatientImage(activeChat)}
                alt={getPatientName(activeChat)}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {getPatientName(activeChat)}
                </h3>
                <p className="text-xs text-green-500 font-medium">Patient</p>
              </div>
              <button
                onClick={deleteConversation}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                title="Delete conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 bg-gray-50/30">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No messages yet. Send a message to start!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg._id || msg.id || idx} className={`flex ${getMessageSender(msg) ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] md:max-w-[70%]">
                      <div className={`p-3 rounded-2xl shadow-sm ${
                        getMessageSender(msg)
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                      }`}>
                        {msg.image && (
                          <div className="mb-2 overflow-hidden rounded-lg">
                            <img
                              src={msg.image}
                              alt=""
                              className="max-w-full h-auto cursor-pointer hover:scale-105 transition-transform rounded-lg"
                              onClick={() => window.open(msg.image, '_blank')}
                            />
                          </div>
                        )}
                        {msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                        <p className={`text-[10px] mt-1.5 text-right opacity-70`}>
                          {formatTime(msg.createdAt || msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex gap-3 items-center">
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.767 17.45a1.5 1.5 0 01-2.121-2.121l10.191-10.191" />
                </svg>
              </button>
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Type your message..."
                className="flex-1 border-none bg-gray-100 rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <button
                disabled={sending || (!messageText.trim() && !image)}
                onClick={sendMessage}
                className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
