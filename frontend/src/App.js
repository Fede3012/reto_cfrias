import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://127.0.0.1:8000/personas/";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      nombre: '',
      apellidos: '',
      edad: '',
      fecha_nacimiento: '',
      tipoModal: ''
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    let nuevapersona = {
      id: 0,
      nombre: this.state.form.nombre === null ? '' : this.state.form.nombre.trim(),
      apellidos: this.state.form.apellidos === null ? '' : this.state.form.apellidos.trim(),
      edad: this.state.form.edad,
      fecha_nacimiento: this.state.form.fecha_nacimiento === null ? '' : this.state.form.fecha_nacimiento
    };
    if (this.validaciones(nuevapersona) === true) {

      delete this.state.form.id;
      await axios.post(url, nuevapersona).then(response => {
        this.modalInsertar();
        this.peticionGet();
      }).catch(error => {
        console.log(error.message);
      })
    }
  }

  peticionPut = () => {
    let personaeditar = {
      id: this.state.form.id,
      nombre: this.state.form.nombre === null ? '' : this.state.form.nombre.trim(),
      apellidos: this.state.form.apellidos === null ? '' : this.state.form.apellidos.trim(),
      edad: this.state.form.edad,
      fecha_nacimiento: this.state.form.fecha_nacimiento === null ? '' : this.state.form.fecha_nacimiento
    }
    if (this.validaciones(personaeditar) === true) {
      axios.put(url, personaeditar).then(response => {
        this.modalInsertar();
        this.peticionGet();
      })
    }
  }

  peticionDelete = () => {
    //axios.delete(url+this.state.form.id).then(response=>{
    axios.delete(url, { params: { persona_id: parseInt(this.state.form.id) } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar, form: {id:0,nombre:'',apellidos:'',edad:'',fecha_nacimiento:''} });
  }

  seleccionarPersona = (persona) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: persona.id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        edad: persona.edad,
        fecha_nacimiento: persona.fecha_nacimiento
      }
    })
  }

  calculateAge(birthday) {
    var ageDifMs = Date.now() - Date.parse(birthday);
    var ageDate = new Date(ageDifMs);
    return (ageDate.getUTCFullYear() - 1970) < 0 ? 0 : (ageDate.getUTCFullYear() - 1970);
  }

  validaciones(persona) {
    if (persona.nombre.trim() === '') { alert('No puede dejar el nombre vacío.'); return false; }
    else if (persona.apellidos.trim() === '') { alert('No puede dejar los apellidos vacíos.'); return false; }
    else if (persona.fecha_nacimiento === '') { alert('No puede dejar fecha de nacimiento sin completar.'); return false; }
    else if (Date.parse(persona.fecha_nacimiento) > Date.now()) { alert('No puede poner una fecha de nacimiento posterior a hoy.'); return false; }
    return true;
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    if (e.target.id === "fecha_nacimiento") {
      let nuevoForm = this.state.form;
      nuevoForm.edad = this.calculateAge(e.target.value);
      this.setState({ form: nuevoForm })
    }
  }

  componentDidMount() {
    this.peticionGet();
  }


  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Persona</button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Edad</th>
              <th>Fecha Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(persona => {
              return (
                <tr>
                  <td>{persona.id}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.apellidos}</td>
                  <td>{persona.edad}</td>
                  <td>{persona.fecha_nacimiento}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarPersona(persona); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarPersona(persona); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : '0'} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />
              <label htmlFor="apellidos">Apellidos</label>
              <input className="form-control" type="text" name="apellidos" id="apellidos" onChange={this.handleChange} value={form ? form.apellidos : ''} />
              <br />
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input className="form-control" type="date" name="fecha_nacimiento" id="fecha_nacimiento" onChange={this.handleChange} value={form ? form.fecha_nacimiento : ''} />
              <br />
              <label htmlFor="edad">Edad</label>
              <input className="form-control" type="text" name="edad" id="edad" readOnly onChange={this.handleChange} value={form ? form.edad : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Estás seguro que deseas eliminar a la persona {form && form.nombre}?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>



    );
  }
}
export default App;
