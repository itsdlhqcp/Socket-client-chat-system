import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CustomNav from '../CustomNav';
import "./chat.css";
import { userData } from '../../helpers';

const Home = () => {
  const { username } = userData();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:1337');
    setSocket(newSocket);

    newSocket.on('recvMsg', (data) => {
      console.log('Received message from server:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '' || !socket) return;

    const clientMessage = {
      meassage: message, 
      username,
      dateTime: new Date(),
    };

    try {
      console.log('Sending message to server:', clientMessage);


      socket.emit('sendMsg', clientMessage);

       setMessages((prevMessages) => [...prevMessages, clientMessage]);

    
      setMessage('');

      await axios.post('http://localhost:1337/api/messages', { data: clientMessage });
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <CustomNav />
      <div className="home">
        <div className="main">
          <div className="name">
            <span><i className="far fa-user"></i></span>
            <h6 id="name-input">Hi</h6>
            <input 
              type="text"
              id="name-input"
              className="name-input"
              value={username}
              readOnly
            />
          </div>

          <ul className="message-container" id="message-container">
          <br/>
            {messages.map((msg, index) => (
              <li key={index} className={msg.username === username ? 'message-right' : 'message-left'}>
                <p className="message">
                  {msg.meassage}
                  <span>{msg.username} ● {new Date(msg.dateTime).toLocaleTimeString()}</span>
                </p>
              </li>
            ))}
          </ul>

          <form className="message-form" id="message-form" onSubmit={sendMessage}>
            <input
              type="text"
              name="message"
              id="message-input"
              className="message-input"
              placeholder='Enter message here'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="v-divider"></div>
            <button type="submit" className="send-button">
              send <span><i className="fas fa-paper-plane"></i></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;


// Fetching of details based on the auth token or id need to be implemented

// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
// import CustomNav from '../CustomNav';
// import "./chat.css";
// import { userData } from '../../helpers';

// const Home = () => {
//   const { username, jwt } = userData(); 
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get('http://localhost:1337/api/messages', {
//           headers: {
//             Authorization: `Bearer ${jwt}`, 
//           },
//         });

//         const fetchedMessages = response.data.data.map((item) => ({
//           ...item.attributes,
//         }));

//         setMessages(fetchedMessages);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     const newSocket = io('http://localhost:1337');
//     setSocket(newSocket);

//     newSocket.on('recvMsg', (data) => {
//       console.log('Received message from server:', data);
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     return () => newSocket.close();
//   }, [jwt]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (message.trim() === '' || !socket) return;

//     const clientMessage = {
//       meassage: message,
//       username,
//       dateTime: new Date(),
//     };

//     try {
//       console.log('Sending message to server:', clientMessage);

//       socket.emit('sendMsg', clientMessage);

//       setMessages((prevMessages) => [...prevMessages, clientMessage]);

//       await axios.post('http://localhost:1337/api/messages', { data: clientMessage }, {
//         headers: {
//           Authorization: `Bearer ${jwt}`, 
//         },
//       });

//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div>
//       <CustomNav />
//       <div className="home">
//         <div className="main">
//           <div className="name">
//             <span><i className="far fa-user"></i></span>
//             <h6 id="name-input">Hi</h6>
//             <input 
//               type="text"
//               id="name-input"
//               className="name-input"
//               value={username}
//               readOnly
//             />
//           </div>

//           <ul className="message-container" id="message-container">
//             <br/>
//             {messages.map((msg, index) => (
//               <li key={index} className={msg.username === username ? 'message-right' : 'message-left'}>
//                 <p className="message">
//                   {msg.meassage}
//                   <span>{msg.username} ● {new Date(msg.dateTime).toLocaleTimeString()}</span>
//                 </p>
//               </li>
//             ))}
//           </ul>

//           <form className="message-form" id="message-form" onSubmit={sendMessage}>
//             <input
//               type="text"
//               name="message"
//               id="message-input"
//               className="message-input"
//               placeholder='Enter message here'
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <div className="v-divider"></div>
//             <button type="submit" className="send-button">
//               send <span><i className="fas fa-paper-plane"></i></span>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
