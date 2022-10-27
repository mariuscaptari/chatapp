import { MessageModel } from "../models/Message";
import { useParams } from "react-router-dom";

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export function Message({ message }: { message: MessageModel }) {
    const { name } = useParams();

    function formatMessageTimestamp(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString().slice(0, 5);
    }

    return (
        <div
            className={classNames(
                "is-flex mt-2",
                message.name === name ? "is-justify-content-flex-end" : "is-justify-content-flex-start"
            )}
        >
            <div style={{ borderRadius: '1rem'}}
                className={classNames(
                    "box py-2 px-2 m-0",
                    message.name === name ? "has-background-info has-text-white" : "has-background-light"
                )}
            >
                <div className="is-flex">
                    <span className=""><b>{message.name}</b>: {message.content}</span>
                </div>
            </div>
            <span
                className="mx-1"
                style={{
                    fontSize: "0.6rem",
                    lineHeight: "1rem",
                }}
            >
                {formatMessageTimestamp(message.date_added)}
            </span>
        </div>
    );
}
