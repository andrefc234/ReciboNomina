import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, FormControl, FormLabel } from 'react-bootstrap';

interface Obra {
  _id: string; 
  obra: string;
  direccion: string;
  metrosC: string;
  metrosT: string;
}

function ObrasTable() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [editObra, setEditObra] = useState<Obra | null>(null);
  const [deleteObra, setDeleteObra] = useState<Obra | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.IP}/api/v1/obra`)
      .then((response) => response.json())
      .then((data) => setObras(data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleEdit = (obra: Obra) => {
    setSelectedObra(obra);
    setEditObra(obra);
    setShowModal(true);
  };

  const handleDelete = (obra: Obra) => {
    setSelectedObra(obra);
    setDeleteObra(obra);
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    if (editObra) {
      fetch(`${process.env.IP}/api/v1/obra/${editObra._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editObra),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update obras state with the updated obra
            setObras((prevObras) =>
              prevObras.map((obra) => (obra._id === data.data._id ? data.data : obra))
            );
            setShowModal(false);
          } else {
            console.error(data.error);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleConfirmDelete = () => {
    if (deleteObra) {
      fetch(`${process.env.IP}/api/v1/obra/${deleteObra._id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Remove the deleted obra from obras state
            setObras((prevObras) => prevObras.filter((obra) => obra._id !== deleteObra._id));
            setShowModal(false);
          } else {
            console.error(data.error);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Obra</th>
            <th>Dirección</th>
            <th>Metros Cuadrados</th>
            <th>Metros Construcción</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(obras) &&
            obras.map((obra) => (
              <tr key={obra._id}>
                <td>{obra.obra}</td>
                <td>{obra.direccion}</td>
                <td>{obra.metrosC}</td>
                <td>{obra.metrosT}</td>
                <td>
                  <Button variant="primary"   className='mx-3'onClick={() => handleEdit(obra)}>
                    Editar
                  </Button>
                  <Button variant="danger"  onClick={() => handleDelete(obra)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar/Eliminar Obra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editObra && (
            <Form>
              <Form.Group>
                <Form.Label>Obra</Form.Label>
                <Form.Control
                  type="text"
                  value={editObra.obra}
                  onChange={(e) => setEditObra({ ...editObra, obra: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  value={editObra.direccion}
                  onChange={(e) => setEditObra({ ...editObra, direccion: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Metros Cuadrados</Form.Label>
                <Form.Control
                  type="text"
                  value={editObra.metrosC}
                  onChange={(e) => setEditObra({ ...editObra, metrosC: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Metros Construcción</Form.Label>
                <Form.Control
                  type="text"
                  value={editObra.metrosT}
                  onChange={(e) => setEditObra({ ...editObra, metrosT: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
          {deleteObra && (
            <p>
             Seguro que quieres eliminar la obra: "{deleteObra.obra}" con el  ID {deleteObra._id}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {editObra && (
            <Button variant="primary" onClick={handleSaveEdit}>
              Actualizar
            </Button>
          )}
          {deleteObra && (
            <Button variant="danger" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ObrasTable;
