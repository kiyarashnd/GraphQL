import { useState } from 'react';
import './App.css';
import { useQuery, useMutation, gql } from '@apollo/client';

//here we write exactly a query that we wrote in appolo server
const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});
  //with this GET_USERS graphql knows what information we want to get from this query
  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);
  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: '2' },
  });

  const [createUser] = useMutation(CREATE_USER);

  if (getUsersLoading) return <p>Data loading...</p>;

  if (getUsersError) return <p>Error : {error.message}</p>;

  const handleCreateUser = () => {
    console.log(newUser);
    createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
    });
  };

  return (
    <>
      <div>
        <input
          type='text'
          placeholder='Name...'
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type='number'
          placeholder='Age...'
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <div>
        {getUserByIdLoading ? (
          <p>loading user...</p>
        ) : (
          <>
            <h2>Chosen user : </h2>
            <p>{getUserByIdData.getUserById.name}</p>
            <p>{getUserByIdData.getUserById.age}</p>
          </>
        )}
      </div>
      <h1>Users</h1>
      <div>
        {getUsersData.getUsers.map((user) => (
          <div>
            <p>Name : {user.name}</p>
            <p>Age : {user.age}</p>
            <p>Is this user Married : {user.isMarried ? 'yes' : 'no'}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
