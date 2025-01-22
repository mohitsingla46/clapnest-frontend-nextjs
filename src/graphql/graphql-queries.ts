import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation signin($email: String!, $password: String!) {
    signin(input: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
        name
        email
        role {
          name
        }
      }
    }
  }
`;

export const GET_ROLES = gql`
  query {
    getRoles {
      id,
      name
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!, $role: String!) {
    signup(input: {
      name: $name,
      email: $email,
      password: $password,
      role: $role,
    }) {
      id
      name
      email
      password
      role {
        id,
        name
      }
    }
  }
`;

export const GET_CHATS = gql`
  query{
    getChats {
      user {
        id
        name
      }
      roomId
      lastMessage
      lastMessageTime
    }
  }
`;

export const GET_CHAT_USERS = gql`
  query {
    getChatUsers {
      id
      name
      email
    }
  }
`;

export const GET_CHAT_HISTORY = gql`
  query getChatHistory($otherUserId: String!){
    getChatHistory(otherUserId: $otherUserId) {
      senderId
      message
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const GET_USER_DETAIL = gql`
  query getUserDetail($id: String!) {
    getUserDetail(id: $id) {
      id
      name
      email
      role {
        id
        name
      }
    }
  }
`;
