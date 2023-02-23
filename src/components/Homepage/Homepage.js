import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ContactForm from '../ContactForm/ContactForm';
import './Homepage.css';

function Homepage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedContact, setSelectedContact] = useState({});
  const [contacts, setContacts] = useState([]);

  const openModal = () => {
    setOpenAddModal(true);
  };
  const closeModal = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
  };

  const cancelAddModal = () => {
    setOpenAddModal(false);
  };
  // const editContact = contact => {
  //     setSelectedContact(contact);
  //     setOpenEditModal(true);
  //   };
  const cancelEditModal = () => {
    setOpenEditModal(false);
  };

  useEffect(()=> {
    // window.electronAPI.listContract( (event, data) => {
    //   // console.log('ssl',data);
    //   setContacts(data);
    // });
  }, [])

  useEffect(()=> {
    window.contactapi.receiveContact( (event, data) => {
      console.log('ssl',data);
      setContacts((contacts) => [...contacts, data]);
    });

    window.contactapi.getOldContacts();
  },[])

  
  return (
    <div className="home-page" style={{ padding: '20px' }}>
      <h1>Contacts</h1>
      <Modal show={openAddModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContactForm
            edit={false}
            onSave={closeModal.bind(this)}
            onCancelAdd={cancelAddModal}
            closeModal={closeModal}
            setContacts= {setContacts}
          />
        </Modal.Body>
      </Modal>
      <Modal show={openEditModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContactForm
            edit
            onSave={closeModal.bind(this)}
            contact={selectedContact}
            onCancelEdit={cancelEditModal}
          />
        </Modal.Body>
      </Modal>
      <ButtonToolbar>
        <Button variant="outline-primary" onClick={openModal}>
          Add Contact
        </Button>
        {/* <Button variant="outline-primary" onClick={refresh}>
          Refresh
        </Button> */}
      </ButtonToolbar>
      <br />
      <div className="table-responsive" style={{ width: '95vw' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>Postal Code</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Age</th>
              {/* <th>Edit</th>
              <th>Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, key) => {
              return(
              <tr key={key}>
                <td>{c.firstName}</td>
                <td>{c.lastName}</td>
                <td>{c.address}</td>
                <td>{c.city}</td>
                <td>{c.country}</td>
                <td>{c.postalCode}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.age}</td>
                {/* <td>
                  <Button
                    variant="outline-primary"
                    onClick={editContact.bind(this, c)}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={deleteSelectedContact.bind(this, c.id)}
                  >
                    Delete
                  </Button>
                </td> */}
              </tr>)
})}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
export default Homepage;