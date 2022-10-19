// import { setDefaultResultOrder } from 'dns';
import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from "react-router-dom";
import { MessageModel } from "../models/Message";
import { Message } from "./Message";

import 'bulma/css/bulma.min.css';

export function Chat() {
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [message, setMessage] = useState("")
  const [searchResult, setSearchResult] = useState("")

  const { room, name } = useParams();

  const { readyState, sendJsonMessage } = useWebSocket("ws://127.0.0.1:8000/ws/" + room + "/", {
    onOpen: () => {
      console.log("Connected!")
    },
    onClose: () => {
      console.log("Disconnected!")
    },
    onMessage: (e) => {
      console.log(e)
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'chat_message_echo':
          setMessageHistory((prev: any) => prev.concat(data.message));
          // setMessageHistory((prev: any) => [data.message, ...prev]);
          break;
        case "message_history":
          setMessageHistory(data.messages);
          break;
        default:
          console.error('Unknown message type!');
          break;
      }
    }
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  function handleChangeMessage(e: any) {
    setMessage(e.target.value)
  }

  // function handleSearchQuery(e: any) {
  //   setSearchResult(e.target.value)
  // }
  const handleKeypress = (e: { keyCode: number; }) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  function handleSubmit() {
    if (message.length === 0) return;
    if (message.length > 512) return;
    sendJsonMessage({
      type: "chat_message",
      name,
      message,
    });
    setMessage("");
  }

  const handleSearch = () => {
    setSearchResult("Get searched messages from backend!")
  }

  return (
    <div>
      <section className="hero is-small is-info">
        <div className="hero-body">
          <p className="title">
            ChatApp 🎃
          </p>
          <p className="subtitle">
            Web and Clound Computing
          </p>
        </div>
      </section>

      <div className="tile is-ancestor">
        <div className="tile is-4 is-vertical is-parent">
          <div className="tile is-child box">
            <p className="title">Channels</p>
            <div className="box">
              <ul className="is-lower-alpha">
                <li>Channel 1</li>
                <li>Channel 2</li>
                <li>Channel 3</li>
                <li>Channel ...</li>
              </ul>
            </div>
          </div>
          <div className="tile is-child box">
            <p className="title">Search messages</p>
            <div className="box">
              <small className="has-text-grey-light" placeholder="SearchieSearch">{searchResult}</small>
            </div>
            <div className="field has-addons">
              <p className="control">
                <input
                  name="search"
                  placeholder="Search Messages"
                  className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"
                  type="text"
                />
              </p>
              <p>
                <button
                  className='ml-3 bg-gray-300 px-3 py-1' onClick={handleSearch}>Search Messages!</button>
              </p>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <p className="title"> <small className="has-text-grey-light">Chating as</small> {name} <small className="has-text-grey-light"> in </small>{room}</p>
            <span className="is-size-7 has-text-grey-light">The WebSocket connection is currently: {connectionStatus}</span>
            <div style={{ overflowY: 'scroll', height: '300px' }} className="box">
              {messageHistory.map((message: MessageModel) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
            <div className="field has-addons">
              <input
                autoFocus
                name="message"
                placeholder='Text message'
                onChange={handleChangeMessage}
                onKeyDown={handleKeypress}
                value={message}
                className="input is-focused" />
              <button className='button' onClick={handleSubmit}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <footer>
          <p>
            <strong>Chat App</strong> by Marius Captari and Lennard Froma (Group 15). The source code can be
            found on <a href="https://github.com/rug-wacc/2022_group_15_s4865928_s2676699">GitHub</a>.
          </p>
        </footer>
      </div>
    </div>
  )
};
