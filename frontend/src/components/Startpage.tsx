import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { uniqueNamesGenerator, Config, adjectives, animals, starWars } from 'unique-names-generator';
import 'bulma/css/bulma.min.css';

export function Startpage() {
    const [room, setRoom] = useState("");
    const [name, setName] = useState("");

    const randNameConfig: Config = {
        dictionaries: [adjectives, animals],
        style: 'capital',
        length: 2,
    };

    const randRoomConfig: Config = {
        dictionaries: [starWars],
        style: 'capital',
    };

    let navigate = useNavigate();
    const routeChange = () => {
        let path = room + '/' + name;
        navigate(path);
    }
    function changeName(e: any) {
        setName(e.target.value)
    }
    function handleSubmit() {
        let formIsValid = true;

        if (!name || !room) {
            formIsValid = false;
        }

        if ((typeof name !== "undefined") && (typeof room !== "undefined")){
            if ((name.match(/[^A-Za-z0-9_-]/)) || (room.match(/[^A-Za-z0-9_-]/))){
                formIsValid = false;
            }
        };
        if (formIsValid) {
            routeChange()
        } else {
            alert("Invalid room or nickname. Please use only letters and numbers, without any spaces or special characters.");
        }
    }

    const handleKeypressSubmit = (e: { keyCode: number; }) => {
        if (e.keyCode === 13) {
          handleSubmit();
        }
      };

    function handleChangeRoom(e: any) {
        setRoom(e.target.value)
    }

    function handleRandomName(e: any) {
        setName(uniqueNamesGenerator(randNameConfig));
    }

    function handleRandomroom(e: any) {
        let rndRoom = uniqueNamesGenerator(randRoomConfig).replace(/ /g,"_");
        setRoom(rndRoom + "_Room");
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
            <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
            <div className="columns is-mobile mt-2">
                <div className="column is-4 is-offset-4">
                <label className="label">Room name</label>
                    <div className="field has-addons">
                    <div className="control is-expanded">
                            <input
                                value={room || ''}
                                autoFocus
                                className="input"
                                type="text"
                                placeholder="Room name"
                                onChange={handleChangeRoom}
                            />
                        </div>
                        <div className="control">
                        <button className="button" onClick={handleRandomroom}>🎲</button>
                        </div>
                    </div>
                    <label className="label">Nickname</label>
                    <div className="field has-addons">
                        <div className="control is-expanded">
                        <input
                                value={name || ''}
                                className="input"
                                type="text"
                                placeholder="Name"
                                onChange={changeName}
                                onKeyDown={handleKeypressSubmit}
                            />
                        </div>
                        <div className="control">
                        <button className="button" onClick={handleRandomName}>🎲</button>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button className="button is-success" onClick={handleSubmit}>Connect</button>
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
