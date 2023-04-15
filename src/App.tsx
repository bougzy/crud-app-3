import React, { useState, useEffect } from 'react';
import axios from 'axios';



interface User {
  id: number;
  name: string;
  email: string;
}

const CrudApp: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, users]);

  const getUsers = async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    setUsers(response.data);
  };

  const addUser = async () => {
    const newUser = { name, email };
    const response = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
    setUsers([...users, response.data]);
    setName('');
    setEmail('');
  };

  const updateUser = async (id: number) => {
    const updatedUser = { name, email };
    const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updatedUser);
    const updatedUsers = users.map(user => user.id === id ? response.data : user);
    setUsers(updatedUsers);
    setName('');
    setEmail('');
  };

  const deleteUser = async (id: number) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  const filterUsers = () => {
    const filtered = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name && email) {
      addUser();
    }
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
  };

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={event => setName(event.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
        </label>
        <button type="submit">Add User</button>
      </form>
      <div>
        <label>
          Search:
          <input type="text" value={search} onChange={event => setSearch(event.target.value)} />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudApp;