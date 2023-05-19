import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, FormControl, FormLabel, Input, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`${process.env.IP}/api/v1/obra`)
      .then((response) => response.json())
      .then((data) => setObras(data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleEdit = (obra: Obra) => {
    setSelectedObra(obra);
    setEditObra(obra);
    onOpen();
  };

  const handleDelete = (obra: Obra) => {
    setSelectedObra(obra);
    setDeleteObra(obra);
    onOpen();
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
            onClose();
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
            onClose();
          } else {
            console.error(data.error);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <Table variant="striped" colorScheme="teal">
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
                  <Button colorScheme="teal" size="sm" onClick={() => handleEdit(obra)}>
                    Edit
                  </Button>
                  <Button colorScheme="red" size="sm" onClick={() => handleDelete(obra)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit/Delete Obra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editObra && (
              <FormControl>
                <FormLabel>Obra</FormLabel>
                <Input value={editObra.obra} onChange={(e) => setEditObra({ ...editObra, obra: e.target.value })} />
                <FormLabel>Dirección</FormLabel>
                <Input
                  value={editObra.direccion}
                  onChange={(e) => setEditObra({ ...editObra, direccion: e.target.value })}
                />
                <FormLabel>Metros Cuadrados</FormLabel>
                <Input
                  value={editObra.metrosC}
                  onChange={(e) => setEditObra({ ...editObra, metrosC: e.target.value })}
                />
                <FormLabel>Metros Construcción</FormLabel>
                <Input
                  value={editObra.metrosT}
                  onChange={(e) => setEditObra({ ...editObra, metrosT: e.target.value })}
                />
              </FormControl>
            )}
            {deleteObra && (
              <p>
                Are you sure you want to delete the obra "{deleteObra.obra}" with ID {deleteObra._id}?
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            {editObra && (
              <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>
                Save
              </Button>
            )}
            {deleteObra && (
              <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
                Delete
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ObrasTable;
