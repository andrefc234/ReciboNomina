import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

interface Obra {
  _id: string;
  obra: string;
  direccion: string;
  metrosC: string;
  metrosT: string;

}

function ObrasTable() {
  const [obras, setObras] = useState<Obra[]>([]);


  useEffect(() => {
    fetch(`${process.env.IP}/api/v1/obra`)
      .then((response) => response.json())
      .then((data) => setObras(data.data))
      .catch((error) => console.error(error));
  }, []);



  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Obra</th>
            <th>Dirección</th>
            <th>Metros Cuadrados</th>
            <th>Material</th>
           
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
           
            
            </tr>
          ))}
        </tbody>
      </Table>

   
    </div>
  );
}

export default ObrasTable;
