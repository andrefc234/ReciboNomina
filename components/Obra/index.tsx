import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';

const SearchableSelect = () => {

  const [obra, setObra] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metrosC, setMetrosC] = useState('');
  const [metrosT, setMetrosT] = useState('');
  const [contactoF, setContactoF] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [rfc, setRfc] = useState('');
  const [curp, setCurp] = useState('');
  const [direccionC, setDireccionC] = useState('');
  const [telefono, setTelefono] = useState('');




  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const data = {
      obra:obra,
      direccion:direccion,
      metrosC:metrosC,
      metrosT:metrosT,
      contactoF:contactoF,
      nombreCliente:nombreCliente,
      rfc:rfc,
      curp:curp,
      direccionC:direccionC,
      telefono:telefono,
    };
    console.log(data)

    const response = axios.post(`${process.env.IP}/api/v1/obra/crear`,data)


    alert('Informacion enviada')
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h3 className="text-dark text-center">Capturar Obra</h3>
        <Row>
          <Col>
            <Form.Group controlId="formObra">
              <Form.Label className="text-dark m-2">OBRA</Form.Label>
              <Form.Control
                type="text"
                placeholder="Agregar nombre obra"
                value={obra}
                onChange={(e) => setObra(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDireccion">
              <Form.Label className="text-dark m-2">DIRECCION</Form.Label>
              <Form.Control
                type="text"
                placeholder="Agregar direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formMetrosC">
              <Form.Label className="text-dark m-2">Metros

cuadrados terreno</Form.Label>
<Form.Control
type="number"
placeholder="Agregar metros cuadrados terreno"
value={metrosC}
onChange={(e) => setMetrosC(e.target.value)}
required
/>
</Form.Group>
</Col>
<Col>
<Form.Group controlId="formMetrosT">
<Form.Label className="text-dark m-2">Metros cuadrados de construcción</Form.Label>
<Form.Control
type="number"
placeholder="Agregar Metros cuadrados de construcción"
value={metrosT}
onChange={(e) => setMetrosT(e.target.value)}
required
/>
</Form.Group>
</Col>
</Row>
<Row>
<Col>
<Form.Group controlId="formContactoF">
<Form.Label className="text-dark m-2">Contacto en obra</Form.Label>
<Form.Control
type="text"
placeholder="Agregar contacto en obra"
value={contactoF}
onChange={(e) => setContactoF(e.target.value)}
required
/>
</Form.Group>
</Col>

</Row>
<h3 className="text-dark text-center mt-3">Datos del cliente</h3>
<Row>
<Col>
<Form.Group controlId="formNombreCliente">
<Form.Label className="text-dark m-2">Nombre</Form.Label>
<Form.Control
type="text"
placeholder="Agregar nombre cliente"
value={nombreCliente}
onChange={(e) => setNombreCliente(e.target.value)}
required
/>
</Form.Group>
</Col>
<Col>
<Form.Group controlId="formRFC">
<Form.Label className="text-dark m-2">RFC</Form.Label>
<Form.Control
type="text"
placeholder="Agregar RFC"
value={rfc}
onChange={(e) => setRfc(e.target.value)}
required
/>
</Form.Group>
</Col>
</Row>
<Row>
<Col>
<Form.Group controlId="formCURP">
<Form.Label className="text-dark m-2">CURP</Form.Label>
<Form.Control
type="text"
placeholder="Agregar CURP"
value={curp}
onChange={(e) => setCurp(e.target.value)}
required
/>
</Form.Group>
</Col>
<Col>
<Form.Group controlId="formDireccionC">
<Form.Label className="text-dark m-2">Dirección</Form.Label>
<Form.Control
type="text"
placeholder="Agregar dirección"
value={direccionC}
onChange={(e) => setDireccionC(e.target.value)}
required
/>
</Form.Group>
</Col>
</Row>
<Row>
<Col>
<Form.Group controlId="formTelefono">
<Form.Label className="text-dark m-2">Teléfono</Form.Label>
<Form.Control
type="text"
placeholder="Agregar teléfono"
value={telefono}
onChange={(e) => setTelefono(e.target.value)}
required
/>
</Form.Group>
</Col>
</Row>

        <br />
        <div className="d-flex justify-content-center align-items-center">
          <Button
            variant="secondary"
            className="text-white m-2 text-center"
            type="submit"
          >
            Agregar
          </Button>
        </div>
      </Form>
    </Container>
  );
};
export default function AgregarObra() {
  return (
    <Container>
      <br />
      <SearchableSelect />
    </Container>
  );
}
