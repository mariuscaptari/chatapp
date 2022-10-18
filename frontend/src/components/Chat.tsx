import { setDefaultResultOrder } from 'dns';
import React, { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from "react-router-dom";

import 'bulma/css/bulma.min.css';

export function Chat() {
  const { conversationName } = useParams();
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState<any>([]);
 
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [searchResult, setSearchResult] = useState("")

  const { readyState, sendJsonMessage } = useWebSocket('ws://127.0.0.1:8000/', {
    onOpen: () => {
      console.log("Connected!")
    },
    onClose: () => {
      console.log("Disconnected!")
    },
    // onMessage handler 
    onMessage: (e) => {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'welcome_message':
          setWelcomeMessage(data.message)
          break;
        case 'chat_message_echo':
          setMessageHistory((prev:any) => prev.concat(data));
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

  function handleChangeName(e: any) {
    setName(e.target.value)
  }

  function handleSearchQuery(e: any){
    setSearchResult(e.target.value)
  }

  const handleSubmit = () => {
    sendJsonMessage({
      type: "chat_message",
      message,
      name
    })
    setName("")
    setMessage("")
  }
  
  const handleSearch = () =>{
    setSearchResult("Get searched messages from backend!")
  }

  return (
    <div>
      <head>
        <title>ChatApp 🍣</title>
      </head>

      <section className="hero is-small is-info">
        <div className="hero-body">
            <p className="title">
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
                    <small className="has-text-grey-light"  placeholder="SearchieSearch">{searchResult}</small>
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
                    <p >
                        <button 
                        className='ml-3 bg-gray-300 px-3 py-1' onClick={handleSearch}>Search Messages!</button>
                    </p>
                </div>
            </div>
        </div>
        <div className="tile is-parent">
            <div className="tile is-child box">
                <p className="title">Chat <small className="has-text-grey-light">{"room_name"}</small></p>
                <div className="box">
                    {/* <div id="chat-messages" style="height: 300px; overflow-y: scroll;">{% for m in messages %}<b>{{ m.username }}</b>: {{ m.content }}<br>{% endfor %}</div> */}
                    <p>"Retrieve messages from backend"</p>
                </div>
                <div className="field has-addons">
                <input 
                  name="message" 
                  placeholder='Message'
                  onChange={handleChangeMessage}
                  value={message}
                  className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"/>
                  <button className='ml-3 bg-gray-300 px-3 py-1' onClick={handleSubmit}  >Submit</button>   
                </div>
            </div>
        </div>
    </div>


      
      {/* <div >
          <div >
            <input 
              name="name" 
              placeholder='Name'
              onChange={handleChangeName}
              value={name}
              className="shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"/>
            
          </div>
      </div> */}
      <div> 
        <footer>
              <p>
                <strong>Chat App</strong> by Marius Captari and Lennard Froma (Group 15). The source code can be
                found on
                <a href="https://github.com/rug-wacc/2022_group_15_s4865928_s2676699">GitHub</a>.
              </p>
        </footer>
      </div>
    </div>
  )
};