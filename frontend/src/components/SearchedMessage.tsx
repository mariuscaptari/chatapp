import { MessageModel } from "../models/Message";
import { useParams } from "react-router-dom";

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export function SearchedMessage({ message }: { message: MessageModel }) {
    const { name } = useParams();

    function formatMessageTimestamp(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString().slice(0, 5);
    }

    function formatMessageDate(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
            date.toLocaleDateString("en-US", { month: 'short' }) +
            "-" + date.toLocaleDateString("en-US", { year: 'numeric' })
    }

    return (
        <div
            className={"is-flex"}>
            {/* <div className={"box py-1 px-1 my-1 mx-1"}> */}
            {/* <div className="is-flex">
                    <span style={{
                    fontSize: "0.6rem",
                    lineHeight: "2rem"
                }} className=" has-text-grey">{message.room}</span>
                </div> */}
            {/* </div> */}
            <div style={{ borderRadius: '1rem' }}
                className={classNames(
                    "box py-2 px-2 my-1 mx-1",
                    message.name === name ? "has-background-info has-text-white" : "has-background-light"
                )}
            >
                <div className="is-flex">
                    <span className=""><b>{message.name}</b>: {message.content}</span>
                </div>
            </div>
            <div className="is-ancestor">
                <div className="is-6 is-vertical is-parent">
                    <div className="is-child">
                        <span
                            className=""
                            style={{
                                fontSize: "0.6rem",
                                // lineHeight: "1rem"
                            }}
                        >
                            {formatMessageDate(message.date_added)}
                        </span>
                        <span
                            className="ml-1"
                            style={{
                                fontSize: "0.6rem",
                                // lineHeight: "1rem"
                            }}
                        >
                            {formatMessageTimestamp(message.date_added)}
                        </span>
                    </div>
                    <div className="is-child">
                        <span style={{
                            fontSize: "0.6rem",
                            lineHeight: "0rem"
                        }} className=" has-text-grey">{message.room}</span>
                    </div>
                </div>
            </div>


        </div>
    );
}
