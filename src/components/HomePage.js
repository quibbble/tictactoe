import React, { useEffect, useState } from "react";
import { Adjectives, Nouns } from "./Words";
import { CreateGame, Health } from "../api/API";
import { useHistory } from "react-router-dom"
import Footer from "./Footer";

export default function HomePage() {
    const history = useHistory();

    const [gid, setGameID] = useState(`${ Adjectives[Math.floor(Math.random()*Adjectives.length)] }-${ Nouns[Math.floor(Math.random()*Nouns.length)] }`);
    const [teams,] = useState(2);

    useEffect(() => {
        async function fetchHealth() {
            let response = await Health();
            if (!response || response.status !== 200) history.push(`/status/down`);
        }
        fetchHealth()
    }, [history])

    async function handleGo(e) {
        e.preventDefault();
        let status = await CreateGame(gid, teams, null);
        if (status === 201 || status === 400) history.push(`/${ gid }`);
    }

    return (
        <div>
            <div className="flex flex-col items-center m-8 md:m-12">
                <div className="w-full max-w-2xl">
                    <div className="flex flex-col items-center">
                        <div className="title text-5xl font-black text-green-600 mb-1 cursor-pointer">
                            <a href={ `${ window.location.protocol }//${ window.location.host }` }>TicTacToe</a>
                        </div>
                        <div className="font-thin mb-3">
                            Play two player TicTacToe online against friends.
                            To create a game or join an existing one, enter a game ID and click 'Go'.
                        </div>
                        <form className="w-full flex mb-2" onSubmit={ handleGo }>
                            <input className="w-10/12 p-2 text-zinc-100 bg-zinc-800 rounded-none border border-zinc-100 text-3xl font-medium box-border focus:outline-dashed outline-blue-500 outline-2" autoFocus type="text" value={ gid } onChange={ e => setGameID(e.target.value) }/>
                            <button className="w-2/12 font-bold grow-0 bg-blue-500">Go</button>
                        </form>
                        <div className="flex w-full justify-between">
                            <div className="italic text-xs bg-blue-500 py-1 px-2">
                                <a href="https://quibbble.com">more <span className="quibbble text-sm not-italic">quibbble</span> games</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 md:bottom-12">
                    <Footer />
                </div>
            </div>
        </div>
    )
}