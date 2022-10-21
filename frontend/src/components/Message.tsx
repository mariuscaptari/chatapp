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
                "mt-1 mb-1 flex",
                message.name === name ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={classNames(
                    "relative max-w-xl rounded-lg px-2 py-1 text-gray-700 shadow",
                    message.name === name ? "" : "bg-gray-100"
                )}
            >
                <div className="flex items-end">
                    <span className="block"><b>{message.name}</b>: {message.content}</span>
                    <span
                        className="ml-2"
                        style={{
                            fontSize: "0.5rem",
                            lineHeight: "1rem"
                        }}
                    >
                        {formatMessageTimestamp(message.date_added)}
                    </span>
                </div>
            </div>
        </div>
    );
}
