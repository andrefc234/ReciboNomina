import React,{useState,useEffect,useRef,MutableRefObject} from 'react';
import { Button, Card, Form,Container } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import axios from 'axios'
import { format } from 'date-fns';



var numeroALetras = (function() {
  // Código basado en el comentario de @sapienman
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num: number) {

      switch (num) {
          case 1:
              return 'UN';
          case 2:
              return 'DOS';
          case 3:
              return 'TRES';
          case 4:
              return 'CUATRO';
          case 5:
              return 'CINCO';
          case 6:
              return 'SEIS';
          case 7:
              return 'SIETE';
          case 8:
              return 'OCHO';
          case 9:
              return 'NUEVE';
      }

      return '';
  } //Unidades()

  function Decenas(num: number) {

      let decena = Math.floor(num / 10);
      let unidad = num - (decena * 10);

      switch (decena) {
          case 1:
              switch (unidad) {
                  case 0:
                      return 'DIEZ';
                  case 1:
                      return 'ONCE';
                  case 2:
                      return 'DOCE';
                  case 3:
                      return 'TRECE';
                  case 4:
                      return 'CATORCE';
                  case 5:
                      return 'QUINCE';
                  default:
                      return 'DIECI' + Unidades(unidad);
              }
          case 2:
              switch (unidad) {
                  case 0:
                      return 'VEINTE';
                  default:
                      return 'VEINTI' + Unidades(unidad);
              }
          case 3:
              return DecenasY('TREINTA', unidad);
          case 4:
              return DecenasY('CUARENTA', unidad);
          case 5:
              return DecenasY('CINCUENTA', unidad);
          case 6:
              return DecenasY('SESENTA', unidad);
          case 7:
              return DecenasY('SETENTA', unidad);
          case 8:
              return DecenasY('OCHENTA', unidad);
          case 9:
              return DecenasY('NOVENTA', unidad);
          case 0:
              return Unidades(unidad);
      }
  } //Unidades()

  function DecenasY(strSin: string, numUnidades: number) {
      if (numUnidades > 0)
          return strSin + ' Y ' + Unidades(numUnidades)

      return strSin;
  } //DecenasY()

  function Centenas(num: number) {
      let centenas = Math.floor(num / 100);
      let decenas: number = num - (centenas * 100);

      switch (centenas) {
          case 1:
              if (decenas > 0)
                  return 'CIENTO ' + Decenas(decenas);
              return 'CIEN';
          case 2:
              return 'DOSCIENTOS ' + Decenas(decenas);
          case 3:
              return 'TRESCIENTOS ' + Decenas(decenas);
          case 4:
              return 'CUATROCIENTOS ' + Decenas(decenas);
          case 5:
              return 'QUINIENTOS ' + Decenas(decenas);
          case 6:
              return 'SEISCIENTOS ' + Decenas(decenas);
          case 7:
              return 'SETECIENTOS ' + Decenas(decenas);
          case 8:
              return 'OCHOCIENTOS ' + Decenas(decenas);
          case 9:
              return 'NOVECIENTOS ' + Decenas(decenas);
      }

      return Decenas(decenas);
  } //Centenas()

  function Seccion(num: number, divisor: number, strSingular: string, strPlural: string) {
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let letras = '';

      if (cientos > 0)
          if (cientos > 1)
              letras = Centenas(cientos) + ' ' + strPlural;
          else
              letras = strSingular;

      if (resto > 0)
          letras += '';

      return letras;
  } //Seccion()

  function Miles(num: number) {
      let divisor = 1000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
      let strCentenas = Centenas(resto);

      if (strMiles == '')
          return strCentenas;

      return strMiles + ' ' + strCentenas;
  } //Miles()

  function Millones(num: number) {
      let divisor = 1000000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
      let strMiles = Miles(resto);

      if (strMillones == '')
          return strMiles;

      return strMillones + ' ' + strMiles;
  } //Millones()

  return function NumeroALetras(num: number, currency: { plural?: any; singular?: any; centPlural?: any; centSingular?: any; }) {
      currency = currency || {};
      let data = {
          numero: num,
          enteros: Math.floor(num),
          centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
          letrasCentavos: '',
          letrasMonedaPlural: currency.plural || 'PESOS CHILENOS', //'PESOS', 'Dólares', 'Bolívares', 'etcs'
          letrasMonedaSingular: currency.singular || 'PESO CHILENO', //'PESO', 'Dólar', 'Bolivar', 'etc'
          letrasMonedaCentavoPlural: currency.centPlural || 'CHIQUI PESOS CHILENOS',
          letrasMonedaCentavoSingular: currency.centSingular || 'CHIQUI PESO CHILENO'
      };

      if (data.centavos > 0) {
          data.letrasCentavos = 'CON ' + (function() {
              if (data.centavos == 1)
                  return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
              else
                  return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
          })();
      };

      if (data.enteros == 0)
          return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
      if (data.enteros == 1)
          return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
      else
          return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  };

})();

type Obra = {
  obra: string;
  pago: number;
}

interface Props {
  obra: Obra[];
  concepto: string;
}

const CrearPdf = ({ obra, concepto }: Props) => {
  const componentRef = useRef<HTMLDivElement | null>(null) as MutableRefObject<HTMLDivElement | null>;
  const fecha = format(new Date(), 'dd/MM/yyyy');
  const [obras, setobras] = useState<string>('');
  const [pagos, setpagos] = useState<string>('');
  const [entregaR, setentregaR] = useState([{nombre:''}]);
  const [activerecibo, setactiverecibo] = useState(false);
  const [cantidadletra, setcantidadletra] = useState<string>("");
  const getEntregaR =  async () => {
    const response = await axios.get(`${process.env.IP}/api/v1/entregaR`)
    setentregaR(response.data)
  }
  const [empleados, setempleados] = useState([{nombre:''}]);

  const getEmpleados = async () => {
    const res = await axios.get(
      `${process.env.IP}/api/v1/empleado`
    );
    const data = await res.data;
    console.log(data);
    setempleados(data);
  };

  useEffect(() => {
    getEmpleados()
    getEntregaR();
  }, []);
const handleObra = (e: { preventDefault: () => void; target: { value: any; }; }) => {

console.log(e.target.value)
setobras(e.target.value)
obra.map((o: { obra: any; pago: number; }) => {
  if(o.obra === e.target.value){
    const cantidadEnLetra = numeroALetras(o.pago,{
      plural: "PESOS",
      singular: "PESO",
      centPlural: "CENTAVOS",
      centSingular: "CENTAVO"
    });

if (cantidadEnLetra !== null) {
  setcantidadletra(cantidadEnLetra);
}
    const formateado = o.pago.toLocaleString("en", {
      style: "currency",
      currency: "MXN"
    });
    setpagos(formateado)
  }
})
setactiverecibo(true)
}
  return (
    <>
  <div className='my-3'>
    <Form.Label className='text-dark' > Obras Seleccionadas</Form.Label>
    <Form.Select onChange={handleObra}>
      <option>-</option>
      {obra.map((o: { obra: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (<>
      <option>{o.obra}</option>
      </>))}
    </Form.Select>
  </div>
    {activerecibo && (<>
      <Container>
     <Card ref={(elem: any) => { componentRef.current = elem }}>
        <Card.Body>
          <div className="encabezado">
            <img src="images/Imagen1.jpg" alt="Logo de la empresa" />
          </div>
          <div className="titulo-y-fecha">
            <div className="titulo">
              <h2 className="text-dark">RECIBO DE CONTRATISTA O PROVEEDOR</h2>
            </div>
            <div className="fecha">
              <p className="text-dark">
                <strong>Fecha:</strong> {fecha}
              </p>
            </div>
          </div>
          <div className="informacion">
            <div className="obra">
             <p className='text-dark'> <strong>Obra: </strong>{obras}</p>
            </div>
            <div className="recibi-de">
              <p className="text-dark">
                <strong>Recibí de:</strong> UNIQUE LIVING
              </p>
            </div>
            <div className="entrego my-3">
            <strong className='text-dark'>Entrego:</strong>
              <Form.Select>
                <option>-</option>
                {entregaR.map(e => (<>
                <option>{e.nombre}</option>
                </>))}
              </Form.Select>
            </div>
            <div className="cantidad">
              <p className="text-dark">
                <strong>Cantidad de:</strong> {pagos}
              </p>
              <p className="text-dark">
                <strong>Cantidad en letra:</strong> $ {cantidadletra}
              </p>
            </div>
            <div className="concepto">
              <p className="text-dark">
                <strong>Concepto:</strong> {concepto}
              </p>
            </div>
          </div>
          <div className="informacion" style={{ display: 'flex' }}>
  <div className="checkboxes" style={{ flex: 1 }}>
    <div className="checkbox">
      <input type="checkbox" />
      <label className="text-dark">EFECTIVO</label>
    </div>
    <div className="checkbox">
      <input type="checkbox" />
      <label className="text-dark">TRANSFERENCIA</label>
    </div>
    <div className="checkbox">
      <input type="checkbox" />
      <label className="text-dark">CHEQUE</label>
    </div>
  </div>
  <div className="datos" style={{ flex: 2 }}>
    <div className="campo">
      <label className="text-dark" style={{ marginRight: '1rem' }}>
        Monto total:
      </label>
    <h5 className='text-dark'>{pagos}</h5>
    </div>
    <div className="campo">
      <label className="text-dark" style={{ marginRight: '1rem' }}>
        A cuenta:
      </label>
      <input type="text"  style={{ width: '100%' }} />
    </div>
    <div className="campo">
      <label className="text-dark" style={{ marginRight: '1rem' }}>
        Saldo:{' '}
      </label>
      <input type="text"  style={{ width: '100%' }} />
    </div>
    <div className="campo">
    <label className="text-dark" style={{ marginRight: '1rem' }}>
        Firma:
      </label>
     <div className='text-center'>
     <select style={{ marginRight: '1rem' ,marginTop:'1rem' }}>
        <option>-</option>
        {empleados.map(e => (<>
        <option>{e.nombre}</option>
        </>))}
      </select>
     </div>
     
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <hr style={{ flex: 1, border: 0, borderTop: '1px solid black' }} />
        <span style={{ marginLeft: '1rem' }}>Firma</span>
      </div>
    </div>
  </div>
</div>



        </Card.Body>
      </Card>
     </Container>
    </>)}
      <ReactToPrint
        trigger={() => <>
        <div className='text-center my-4'>
        <Button variant="primary">Imprimir a PDF</Button>
        </div>
        </>}
        content={() => componentRef.current}
      />
    </>
  );
};

export default CrearPdf;
