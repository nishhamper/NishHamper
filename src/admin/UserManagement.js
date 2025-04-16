import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container py-5">
      <h3 className="text-center text-primary mb-4">Firebase Auth Users</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>User UID</th>
            <th>Sign-Up Date</th>
            <th>Last Sign-In</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.uid}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{new Date(user.lastSignIn).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;
