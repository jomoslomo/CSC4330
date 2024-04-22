
// // src/pages/ConversationPage/ConversationPage.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // Import useParams hook to access route parameters
// import './ConversationPage.css';

// function ConversationPage() {
//     const { userId } = useParams(); // Get userId from route parameters
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         fetchConversation(userId);
//     }, [userId]);

//     const fetchConversation = async (userId) => {
//         const token = localStorage.getItem('token');
//         // Update this endpoint to fetch messages for the conversation with the selected user
//         const response = await fetch(`http://localhost:3001/conversations/${userId}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         if (response.ok) {
//             const data = await response.json();
//             setMessages(data);
//         } else {
//             console.error('Failed to fetch conversation');
//         }
//     };

//     return (
//         <div className="conversationPage">
//             <h2>Conversation</h2>
//             <div className="messagesList">
//                 {messages.map((message) => (
//                     <div key={message._id} className="message">
//                         <p>{message.content}</p>
//                     </div>
//                 ))}
//             </div>
//             {/* Add message sending form here */}
//         </div>
//     );
// }

// export default ConversationPage;
