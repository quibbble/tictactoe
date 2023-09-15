import React, { useEffect, useState, forwardRef, useCallback } from "react";


export const Game = forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const { ws, game, network, chat, connected, error } = props;

    // websocket messages
    const markLocation = (team, row, col) => {
        if (!ws.current) return;
        ws.current.send(JSON.stringify({"ActionType": "MarkLocation", "Team": team, "MoreDetails": {"Row": row, "Column": col}}));
    }

    // game data
    const [board, setBoard] = useState([]);
    useEffect(() => {
        if (game && game.MoreData) setBoard(game.MoreData.Board)
    }, [game])

    // network data
    const [team, setCurrentTeam] = useState("");
    useEffect(() => {
        if (network && connected) setCurrentTeam(connected[network.Name])
    }, [network, connected])

    // board must stay at a 3x3 width to height ratio
    const [tileSize, setTileSize] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const handleResize = useCallback(() => {
        const width = 3;
        const height = 3;
        if (!ref || !ref.current) return;
        if (ref.current.clientHeight/height < ref.current.clientWidth/width) {
            setWidth(ref.current.clientHeight/height*width);
            setHeight(ref.current.clientHeight);
            setTileSize(ref.current.clientHeight/height);
        } else {
            setWidth(ref.current.clientWidth);
            setHeight(ref.current.clientWidth/width*height);
            setTileSize(ref.current.clientWidth/width);
        }
    }, [ref])

    useEffect(() => handleResize());

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return _ => window.removeEventListener("resize", handleResize)
    }, [handleResize]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center grow">
            <div className="flex flex-col justify-center overflow-hidden" style={{width: `${width}px`, height: `${height}px`}}>
            {
                board.map((row, rIdx) =>
                    <div key={rIdx} className="w-full flex justify-center" style={{height: `${tileSize}px`}}>
                        {
                            row.map((mark, cIdx) =>
                            <div key={`${rIdx},${cIdx}`} className="flex items-center justify-center cursor-pointer" style={{width: `${tileSize}px`, height: `${tileSize}px`}} onClick={() => markLocation(team, rIdx, cIdx)}>
                                <div className={`w-full h-full flex flex-col items-center justify-center ${rIdx > 0 ? "border-t" : ""} ${cIdx < 2 ? "border-r" : ""} border-zinc-100 text-6xl font-bold font-sans ${mark === "O" ? `text-red-500` : "text-blue-500"}`}>{ mark.toUpperCase() }</div>
                            </div>)
                        }
                    </div>
                )
            }
            </div>
        </div>
    )
})
