import React, { useState } from 'react';

import { useNavigate } from "react-router-dom";
import 'bulma/css/bulma.min.css';

export function Startpage(){
    const [room, setRoom] = useState("")
    const [name, setName] = useState("")

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = room + '/' + name; 
      navigate(path);
    }
    function handleChangeName(e: any) {
        setName(e.target.value)
    }
    function handleChangeRoom(e: any) {
        setRoom(e.target.value)
    }
    
    return (       
        <div>
            <section className="hero is-small is-info">
                <div className="hero-body">
                    <p className="title">
                        ChatApp 🍣
                    </p>
                    <p className="subtitle">
                        Web and Cloud Computing
                    </p>
                </div>
            </section>

            <div className="container is-centered mt-6">
                <div className="field">
                    <label className="label">Room name</label>
                    <div className="control">
                        <input 
                            autoFocus
                            className="input" 
                            type="text" 
                            placeholder="Room name" 
                            onChange={handleChangeRoom}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Nickname</label>
                    <div className="control">
                        <input 
                        className="input" 
                        type="text" 
                        placeholder="Name" 
                        onChange={handleChangeName}
                        required
                        />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <a className="button is-info" onClick={routeChange}>Connect</a>
                    </div>
                </div>
            </div>
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