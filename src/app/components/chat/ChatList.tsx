import { GET_CHATS } from '@/graphql/graphql-queries';
import { ChatList as Chats } from '@/types/ChatList';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const ChatList = () => {
	const [chats, setChats] = useState<Chats[]>([]);
	const { data } = useQuery(GET_CHATS);

	useEffect(() => {
		if (data) {
			setChats(data.getChats);
		}
	}, [data]);

	return (
		<div className="divide-y divide-gray-200">
			{chats.length > 0 ? (
				chats.map((chat) => (
					<Link
						href={`/chat/${chat.user.id}`}
						key={chat.user.id}
						className="flex items-center p-4 hover:bg-gray-100"
					>
						<img
							src="https://placehold.co/50"
							alt="User"
							className="rounded-full w-12 h-12 object-cover"
						/>
						<div className="ml-4 flex-grow">
							<h6 className="text-base font-medium text-gray-800">{chat.user.name}</h6>
							<small className="text-sm text-gray-500">{chat.lastMessage}</small>
						</div>
						<small className="text-sm text-gray-500">{chat.lastMessageTime}</small>
					</Link>
				))
			) : (
				<div className="p-4 text-center">
					<p className="text-gray-500">No chats here. Start a new conversation!</p>
				</div>
			)}
		</div>
	)
}

export default ChatList