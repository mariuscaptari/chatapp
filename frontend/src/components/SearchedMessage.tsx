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
            className={classNames(
                "is-flex mt-0",
                message.name === name ? "is-justify-content-flex-end" : "is-justify-content-flex-start"
            )}>
            <div className={"box py-2 px-2 mr-2 has-background-warning"}>
                <div className="is-flex">
                    <span className=""><b>{message.room}</b></span>
                </div>
            </div>
            <div
                className={classNames(
                    "box py-2 px-2",
                    message.name === name ? "has-background-info has-text-white" : "has-background-light"
                )}
            >
                <div className="is-flex">
                    <span className=""><b>{message.name}</b>: {message.content}</span>
                </div>
            </div>
            <span
                className="ml-2"
                style={{
                    fontSize: "0.6rem",
                    lineHeight: "1rem"
                }}
            >
                {formatMessageTimestamp(message.date_added)}
            </span>
            <span
                className="mx-2"
                style={{
                    fontSize: "0.6rem",
                    lineHeight: "1rem"
                }}
            >
                {formatMessageDate(message.date_added)}
            </span>
        </div>
    );
}
