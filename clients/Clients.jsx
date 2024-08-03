import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Modal, Button } from 'react-bootstrap';
import "./Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [residency, setResidency] = useState("");
  const [loading, setLoading] = useState(true);

  const toggleAddModal = () => {
    setClientName("");
    setResidency("");
    setShowAddModal(!showAddModal);
  };

  const toggleUpdateModal = () => setShowUpdateModal(!showUpdateModal);

  const getClients = async () => {
    try {
      const response = await fetch("http://localhost:5038/api/ClientApi/GetClients");
      const result = await response.json();
      setClients(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
    }
  };

  const saveClient = async () => {
    const dataToSend = {
      clientName: clientName,
      residency: residency,
    };

    await fetch("http://localhost:5038/api/ClientApi/SaveClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    getClients();
    setClientName("");
    setResidency("");
    toggleAddModal();
  };

  const updateClient = async (id) => {
    const dataToSend = {
      clientName: clientName,
      residency: residency,
    };

    await fetch("http://localhost:5038/api/ClientApi/UpdateClient?Id=" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    getClients();
    toggleUpdateModal();
  };

  const deleteClient = async (id) => {
    await fetch("http://localhost:5038/api/ClientApi/DeleteClient/" + id, {
      method: "DELETE",
    });

    getClients();
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleDetailsClick = (client) => {
    setSelectedClient(client);
    setClientName(client.clientName);
    setResidency(client.residency);
  };

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  if (loading) {
    return (
      <center>
        <h1>Loading, please wait...</h1>
      </center>
    );
  }

  return (
    <>
      <Modal className="modal-center" show={showAddModal} onHide={toggleAddModal}>
        <Modal.Header closeButton>New Client Info</Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client Name"
          />
          <input
            type="text"
            value={residency}
            onChange={(e) => setResidency(e.target.value)}
            placeholder="Residency"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveClient}>Save Client</Button>
        </Modal.Footer>
      </Modal>

      <Modal className="modal-center" show={showUpdateModal} onHide={toggleUpdateModal}>
        <Modal.Header closeButton>Update Client Info</Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client Name"
          />
          <input
            type="text"
            value={residency}
            onChange={(e) => setResidency(e.target.value)}
            placeholder="Residency"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateClient(selectedClient.id)}>Update Client</Button>
        </Modal.Footer>
      </Modal>

      <div className="app-container">
        <h1 className="app-header">MGA CLIENTS</h1>
        <Card>
          <Button className="buttons2" onClick={toggleAddModal}>
            Add Clients +
          </Button>
        </Card>

        {selectedClient && (
          <div className="client-details">
            <h2>Client Details</h2>
            <p>
              <strong>Name:</strong> {selectedClient.clientName}
            </p>
            <p>
              <strong>Residency:</strong> {selectedClient.residency}
            </p>
            <Button onClick={handleUpdateClick} className="buttons">Update</Button>
            <Button onClick={() => setSelectedClient(null)} className="buttons">Close</Button>
          </div>
        )}

        <Row xs={1} md={3} className="g-4">
          {clients.map((client) => (
            <Col key={client.id}>
              <Card className="team-card">
                <Card.Body>
                  <Card.Title>
                    <strong>Name:</strong> {client.clientName}
                  </Card.Title>
                  <Card.Title>
                    <strong>Address:</strong> {client.residency}
                  </Card.Title>
                  <Button
                    onClick={() => handleDetailsClick(client)}
                    className="buttons"
                  >
                    See Client Details
                  </Button>
                  <Button onClick={() => deleteClient(client.id)} className="buttons">Delete Client</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Clients;
