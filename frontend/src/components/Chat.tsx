import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams, Link } from "react-router-dom";
import { MessageModel } from "../models/Message";
import { Message } from "./Message";
import { SearchedMessage } from "./SearchedMessage";

import 'bulma/css/bulma.min.css';

export function Chat() {
  const bottomRefHistory = useRef<null | HTMLDivElement>(null);
  const bottomRefSearch = useRef<null | HTMLDivElement>(null);
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [roomList, setRoomList] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const { room, name } = useParams();
  //const { readyState, sendJsonMessage } = useWebSocket(`ws://localhost:8000/ws/${room}/`, {
  const { readyState, sendJsonMessage } = useWebSocket(`ws://${window.location.hostname}/ws/${room}/`, {
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
          console.log("Received a new chat message!");
          setMessageHistory((prev: any) => prev.concat(data.message));
          break;
        case "message_history":
          console.log("Loaded chat history!")
          setMessageHistory(data.messages);
          break;
        case "search_results":
          console.log("Received search results!")
          setSearchResult(data.messages);
          break;
        case "room_list":
          console.log("Received list of rooms!")
          setRoomList(data.rooms);
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
    if (bottomRefHistory.current) {
      bottomRefHistory.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'start',
        })
    }
  }, [messageHistory])

  useEffect(() => {
    if (bottomRefSearch.current) {
      bottomRefSearch.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'start',
        })
    }
  }, [searchResult])


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
    if (searchMessage.length === 0) return;
    if (searchMessage.length > 64) return;
    console.log("Searching for all texts with: " + searchMessage)
    sendJsonMessage({
      type: "search_messages",
      searchMessage: searchMessage,
    });
    setSearchMessage("");
  }

  return (
    <div>
      <section className="hero is-small has-background-info-light">
        <div className="hero-body">
          <p className="title has-text-info-dark">
            ChatApp 🍣
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
            <ul style={{ overflowY: 'scroll', height: '180px' }}>
              {roomList.map((room: string, index: number) =>
                <li key={index}>
                  <Link to={`/${room}/${name}`} className="" >
                    {room}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="tile is-child box">
            <p className="title is-4">Search messages</p>
            <div style={{ overflowY: 'scroll', height: '200px' }}>
              {searchResult.map((message: MessageModel) => (
                <SearchedMessage key={message.id} message={message} />
              ))}
              <div ref={bottomRefSearch} />
            </div>
            <div className="mt-4 field has-addons">
              <input
                name="search"
                placeholder="Text to search across all rooms"
                className="input"
                type="text"
                onChange={handleChangesearchMessage}
                onKeyDown={handleKeypressSearch}
                value={searchMessage}
              />
              <p>
                <button
                  className='button is-info is-light ml-1' onClick={handleSearch}>Search</button>
              </p>
            </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child box">
            <p className="title"> <small className="has-text-grey-light">Chatting as</small> {name} <small className="has-text-grey-light"> inside </small>{room}</p>
            <span className="has-text-grey-light">The connection is currently: {connectionStatus} </span>
            <div style={{ overflowY: 'scroll', height: '450px' }} className="box mt-2">
              {messageHistory.map((message: MessageModel) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={bottomRefHistory} />
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
              <button className='button is-success ml-1' onClick={handleSubmit}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
