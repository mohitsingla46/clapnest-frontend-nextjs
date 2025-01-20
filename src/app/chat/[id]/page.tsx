"use client";

import { GET_CHAT_HISTORY } from '@/graphql/graphql-queries';
import { ChatDetail as Chat } from '@/types/ChatDetail';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ChatDetail = () => {
    const { id: roomId } = useParams();
    const [chat, setChat] = useState<Chat[]>([]);
    const { data } = useQuery(GET_CHAT_HISTORY, {
        variables: { roomId },
        skip: !roomId,
    });

    useEffect(() => {
        if (data) {
            setChat(data.getChats);
        }
    }, [data]);
    return (
        <div>ChatDetail</div>
    )
}

export default ChatDetail