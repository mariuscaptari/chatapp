import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bulma/css/bulma.min.css';

export function Startpage(this: any) {
    const [room, setRoom] = useState("")
    const [name, setName] = useState("")

    let navigate = useNavigate();
    const routeChange = () => {
        let path = room + '/' + name;
        navigate(path);
    }
    function changeName(e: any) {
        setName(e.target.value)
    }
    function handleChangeName(e: any) {
        setName(e.target.value)
        let formIsValid = true;

        if (!name) {
            formIsValid = false;
        }

        if (typeof name !== "undefined") {
            if (name.match(/[^A-Za-z0-9]/)) {
                formIsValid = false;
            }
        };

        if (formIsValid) {
            routeChange()
        } else {
            alert("Invalid room or nickname. Please use only letters and numbers, without any spaces or special characters.");
        }
    }
    function handleChangeRoom(e: any) {
        setRoom(e.target.value)
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <section className="hero is-small has-background-info-light">
                <div className="hero-body">
                    <p className="title has-text-info-dark">
                        ChatApp 🍣
                    </p>
                    <p className="subtitle">
                        Web and Cloud Computing
                    </p>
                </div>
            </section>
            <div className="columns is-mobile mt-2">
                <div className="column is-4 is-offset-4">
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
                                onChange={changeName}
                                required
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button className="button is-success" onClick={handleChangeName}>Connect</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer" style={{ marginTop: 'auto' }}>
                <div className="content has-text-centered">
                    <p>
                        <strong>Chat App</strong> by Marius Captari and Lennard Froma (Group 15). The source code can be
                        found on <a href="https://github.com/rug-wacc/2022_group_15_s4865928_s2676699">GitHub</a>.
                    </p>
                </div>
            </footer>
        </div>
    )
};
