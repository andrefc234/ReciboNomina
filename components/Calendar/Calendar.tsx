import React, { useState, useEffect } from 'react';
import { format, isToday, isSameDay, addDays, subDays, eachDayOfInterval } from 'date-fns';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { es } from 'date-fns/locale';
import axios from 'axios'
import CrearPdf from '@/components/CrearPdf'
import ExModal from '@/components/Tools/ExModal'
interface ReciboNomina {
  _id: string;
  obra: string;
  pago: number;
  fecha?: Date;
  __v: number;
}

const DayView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [recibosNomina, setRecibosNomina] = useState<ReciboNomina[]>([]);

  useEffect(() => {
    fetchRecibosNomina();
  }, [currentDate]);

  const fetchRecibosNomina = async () => {
    try {
      // Replace 'apiEndpoint' with the actual API endpoint to fetch payroll receipts
      const response = await axios.get(`${process.env.IP}/api/v1/recibo/obra`);
    
     
      console.log(response)
      setRecibosNomina(response.data.data);
    } catch (error) {
      console.error('Error fetching payroll receipts:', error);
    }
  };

  const weekStart = subDays(currentDate, currentDate.getDay());
  const weekEnd = addDays(weekStart, 6);
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getDayName = (date: Date) => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = date.getDay();
    return dayNames[dayIndex];
  };
  const [showModal, setShowModal] = useState(false);
  const [obra, setobra] = useState({pago:0,obra:''});

interface MD {
  obra:string;
  pago:number;
}
const handleOpenModal = ({ obra, pago }: MD) => {
  setShowModal(true);
  const data = {
    obra: obra,
    pago: pago,
  };
  setobra(data);
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <Button onClick={handlePrevWeek}>Semana Pasada </Button>
        </Col>
        <Col className="text-center">
          <h4>{format(weekStart, 'MMMM d, yyyy', { locale: es })} - {format(weekEnd, 'MMMM d, yyyy', { locale: es })}</h4>
        </Col>
        <Col className="text-end">
          <Button onClick={handleNextWeek}>Siguiente Semana</Button>
        </Col>
      </Row>
      <Row>
        {weekDates.map((date) => {
          const recibosNominaOnDay = recibosNomina.filter((recibo) => recibo.fecha && isSameDay(date, new Date(recibo.fecha)));
          return (
            <Col key={date.toISOString()} xs={12} md={6} lg={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{getDayName(date)}</Card.Title>
                  <Card.Text>{format(date, 'MMMM d, yyyy', { locale: es })}</Card.Text>
                  <Row>
                    {recibosNominaOnDay.length > 0 ? (
                      recibosNominaOnDay.map((recibo) => (
                        <Col key={recibo._id}>
                          <Card className="mb-3">
                            <Card.Body  onClick={() =>handleOpenModal(recibo)} >
                            
                              <Card.Text>Obra: {recibo.obra}</Card.Text>
                            </Card.Body>
                            
                          </Card>
                         
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <Card.Text className="text-muted">No hay recibos de nomina para este día.</Card.Text>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <ExModal
        title={obra.obra}
        bodyComponent={<CrearPdf obra={obra} concepto='' />}
        showModal={showModal}
        handleClose={handleCloseModal}
      />
    </Container>
  );
};

export default DayView;
