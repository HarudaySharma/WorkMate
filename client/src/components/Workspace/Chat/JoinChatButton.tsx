import React from "react"
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { UserPlus } from 'lucide-react';
import toast from "react-hot-toast";
import { ErrorFormat } from "../../../types";
import joinChat from "../../../utils/joinChat";
import useChatContext from "../../../hooks/useChatContext";

interface JoinChatPopupButtonParams {
    onJoin?: () => void;
}

const JoinChatPopupButton = ({ onJoin }: JoinChatPopupButtonParams) => {
    const {
        workspace: { id: workspaceId },
        selectedChat,
    } = useChatContext()

    const [isOpen, setIsOpen] = useState(false);

    const handleJoin = async () => {
        setIsOpen(false);

        if (!selectedChat) {
            toast.error("no chat selected")
            return
        }

        if (onJoin) onJoin(); // optional callback to notify parent
        // Call API or state update to join the chat

        try {
            const ret = await joinChat({
                chatId: selectedChat.id,
                workspaceId: workspaceId,
                role: 'member',
            })

            toast.success(ret.message || "joined successfully")

        } catch (err) {
            toast.error((err as ErrorFormat).message)
        }
    };

    if (!selectedChat) {
        return (<></>)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-customYellow text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            >
                <UserPlus size={20} />
                Join Chat
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-96">
                    <Dialog.Title className="text-lg font-semibold text-gray-800">Join Chat</Dialog.Title>
                    <Dialog.Description className="mt-2 text-gray-600">
                        You're not a member of this chat. Would you like to join?
                    </Dialog.Description>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleJoin}
                            className="px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default JoinChatPopupButton;

