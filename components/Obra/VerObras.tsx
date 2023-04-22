import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

interface Obra {
  _id: string;
  obra: string;
  direccion: string;
  metrosC: string;
  metrosT: string;
  contactoF: string;
  nombreCliente: string;
  rfc: string;
  material: { nombre: string; progreso: { compras: string; contaduria: string }; partida: string; cantidad: string }[];
  curp: string;
  direccionC: string;
  telefono: string;
  idRequerimientos: { id: string }[];
}

function ObrasTable() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updateObra, setUpdateObra] = useState<Obra>({
    _id: '',
    obra: '',
    direccion: '',
    metrosC: '',
    metrosT: '',
    contactoF: '',
    nombreCliente: '',
    rfc: '',
    material: [],
    curp: '',
    direccionC: '',
    telefono: '',
    idRequerimientos: [],
  });

  useEffect(() => {
    fetch(`http://${process.env.IP}:5000/api/v1/obra`)
      .then((response) => response.json())
      .then((data: Obra[]) => setObras(data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleDeleteObra = (id: string) => {
    fetch(`http://${process.env.IP}:5000/api/v1/obra/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => setObras((prevObras) => prevObras.filter((obra) => obra._id !== id)))
      .catch((error) => console.error(error));
  };

  const handleShowUpdateModal = (obra: Obra) => {
    setShowUpdateModal(true);
    setUpdateObra(obra);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateObra({
      _id: '',
      obra: '',
      direccion: '',
      metrosC: '',
      metrosT: '',
      contactoF: '',
      nombreCliente: '',
      rfc: '',
      material: [],
      curp: '',
      direccionC: '',
      telefono: '',
      idRequerimientos: [],
    });
  };

  const handleUpdateObra = () => {
    fetch(`http://${process.env.IP}:5000/api/v1/obra/${updateObra._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        obra: updateObra.obra,
        direccion: updateObra.direccion,
        metrosC: updateObra.metrosC,
        metrosT: updateObra.metrosT,
        contactoF: updateObra.contactoF,
        nombreCliente: updateObra.nombreCliente,
        rfc: updateObra.rfc,
        material: updateObra.material,
        curp: updateObra.curp,
        direccionC: updateObra.direccionC,
        telefono: updateObra.telefono,
        idRequerimientos: updateObra.idRequerimientos,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setObras((prevObras) =>
          prevObras.map((obra) => {
            if (obra._id === updateObra._id) {
              return {
                ...obra,
                obra: updateObra.obra,
                direccion: updateObra.direccion,
                metrosC: updateObra.metrosC,
                metrosT: updateObra.metrosT,
                contactoF: updateObra.contactoF,
                nombreCliente: updateObra.nombreCliente,
                rfc: updateObra.rfc,
                material: updateObra.material,
                curp: updateObra.curp,
                direccionC: updateObra.direccionC,
                telefono: updateObra.telefono,
                idRequerimientos: updateObra.idRequerimientos,
              };
            }
            return obra;
          })
        );
        handleCloseUpdateModal();
      })
      .catch((error) => console.error(error));
  };


  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Obra</th>
            <th>Dirección</th>
            <th>Metros Cuadrados</th>
            <th>Material</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
          
          Array.isArray(obras) && 
          obras.map((obra) => (
            <tr key={obra._id}>
              <td>{obra.obra}</td>
              <td>{obra.direccion}</td>
              <td>{obra.metrosC}</td>
              <td>
                {obra.material.map((m) => (
                  <span key={m.nombre}>{m.nombre} - {m.cantidad}</span>
                ))}
              </td>
              <td>
                <Button variant="primary" onClick={() => handleShowUpdateModal(obra)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteObra(obra._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

   
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Obra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Obra</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre de la obra"
                value={updateObra.obra}
                onChange={(e) =>
                  setUpdateObra({ ...updateObra, obra: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Dirección de la obra"
                value={updateObra.direccion}
                onChange={(e) =>
                  setUpdateObra({ ...updateObra, direccion: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Metros Cuadrados</Form.Label>
              <Form.Control
                type="text"
                placeholder="Metros cuadrados"
                value={updateObra.metrosC}
                onChange={(e) =>
                  setUpdateObra({ ...updateObra, metrosC: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Material</Form.Label>
              {updateObra.material.map((m, index) => (
                <div key={index}>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del material"
                    value={m.nombre}
                    onChange={(e) => {
                      const newMaterial = [...updateObra.material];
                      newMaterial[index].nombre = e.target.value;
                      setUpdateObra({ ...updateObra, material: newMaterial });
                    }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Cantidad"
                    value={m.cantidad}
                    onChange={(e) => {
                      const newMaterial = [...updateObra.material];
                      newMaterial[index].cantidad = e.target.value;
                      setUpdateObra({ ...updateObra, material: newMaterial });
                    }}
                  />
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={() =>
                  setUpdateObra({
                    ...updateObra,
                    material: [
                      ...updateObra.material,
                      { nombre: '', cantidad: '' },
                    ],
                  })
                }
              >
                Agregar material
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateObra}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ObrasTable;