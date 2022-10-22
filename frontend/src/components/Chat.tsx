// import { setDefaultResultOrder } from 'dns';
import React from 'react';
import { useState, useEffect, useRef} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from "react-router-dom";
import { MessageModel } from "../models/Message";
import { Message } from "./Message";

import 'bulma/css/bulma.min.css';

export function Chat() {
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

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
        case "search_results":
          console.log("Received search results!")
          setSearchResult(data.messages);
          console.log(searchResult)
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [message]);

  function handleChangeMessage(e: any) {
    setMessage(e.target.value)
  }

  function handleChangesearchMessage(e: any) {
    setSearchMessage(e.target.value)
  }

  const handleKeypressSubmit = (e: { keyCode: number; }) => {
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

  const handleKeypressSearch = (e: { keyCode: number; }) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    console.log("before send json");
    // setSearchResult("Get searched messages from backend!");
    if (searchMessage.length === 0) return;
    if (searchMessage.length > 64) return;
    console.log(searchMessage)
    sendJsonMessage({
      type: "search_messages",
      searchMessage: searchMessage,
    });
    console.log("after send json")
    setSearchMessage("");
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
            <p className="title is-4">Rooms</p>
              <ul className="is-lower-alpha">
                <li>Channel 1</li>
                <li>Channel 2</li>
                <li>Channel 3</li>
                <li>Channel ...</li>
              </ul>
          </div>
          <div className="tile is-child box">
            <p className="title is-4">Search messages</p>
              <div style={{ overflowY: 'scroll', height: '200px' }}>
                {searchResult.map((message: MessageModel) => (
                  <Message key={message.id} message={message} />
                ))}
              </div>
            <div className="field has-addons">
              <p className="control">
                <input
                  name="search"
                  placeholder="Text to match"
                  className="input"
                  type="text"
                  onChange={handleChangesearchMessage}
                  onKeyDown={handleKeypressSearch}
                  value={searchMessage}
                />
              </p>
              <p>
                <button
                  className='button' onClick={handleSearch}>Search</button>
              </p>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <p className="title"> <small className="has-text-grey-light">Chating as</small> {name} <small className="has-text-grey-light"> in </small>{room}</p>
            <span className="pb-2 has-text-grey-light">The connection is currently: {connectionStatus}</span>
            <div style={{ overflowY: 'scroll', height: '450px' }} className="box">
              {messageHistory.map((message: MessageModel) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="field has-addons">
              <input
                autoFocus
                name="message"
                placeholder='Text message'
                onChange={handleChangeMessage}
                onKeyDown={handleKeypressSubmit}
                value={message}
                className="input is-focused" />
              <button className='button' onClick={handleSubmit}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <footer>
          <p>
            <strong>Chat App</strong> by Marius Captari and Lennard Froma (Group 15). The source code can be
            found on <a href="https://github.com/rug-wacc/2022_group_15_s4865928_s2676699">GitHub</a>.
          </p>
        </footer> */}
      </div>
    </div>
  )
};
