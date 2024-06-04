import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({
    name: "",
    sport: "",
    description: "",
    availability: true,
    capacity: 0,
    location: "",
    imageUrl: "",
  });
  const [editFacility, setEditFacility] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const firestore = getFirestore();
      const facilitiesCollection = collection(firestore, "facilities");
      const facilitiesSnapshot = await getDocs(facilitiesCollection);
      const facilitiesData = facilitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFacilities(facilitiesData);
    } catch (error) {
      console.log("Error fetching facilities:", error);
    }
  };

  const handleDeleteFacility = async (facilityId) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez eliminada, no podrás recuperar esta instalación deportiva.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then(async (confirmed) => {
      if (confirmed) {
        try {
          const firestore = getFirestore();
          const facilityRef = doc(firestore, "facilities", facilityId);
          await deleteDoc(facilityRef);
          console.log("Instalación eliminada correctamente");
          fetchFacilities();
        } catch (error) {
          console.log("Error al eliminar la instalación:", error);
        }
      } else {
        console.log("Eliminación cancelada");
      }
    });
  };

  const handleAddFacility = async () => {
    try {
      const firestore = getFirestore();
      const facilitiesCollection = collection(firestore, "facilities");
      const newFacilityData = {
        name: newFacility.name,
        sport: newFacility.sport,
        description: newFacility.description,
        availability: newFacility.availability,
        capacity: newFacility.capacity,
        location: newFacility.location,
        imageUrl: newFacility.imageUrl,
      };
      await addDoc(facilitiesCollection, newFacilityData);
      console.log("Instalación agregada correctamente");
      setNewFacility({
        name: "",
        sport: "",
        description: "",
        availability: true,
        capacity: 0,
        location: "",
        imageUrl: "",
      });
      // Actualiza el estado de las instalaciones después de agregar una nueva
      fetchFacilities();
    } catch (error) {
      console.log("Error adding facility:", error);
    }
  };

  const handleEditFacility = async () => {
    try {
      const firestore = getFirestore();
      const facilityRef = doc(firestore, "facilities", editFacility.id);
      await updateDoc(facilityRef, {
        name: editFacility.name,
        sport: editFacility.sport,
        description: editFacility.description,
        availability: editFacility.availability,
        capacity: editFacility.capacity,
        location: editFacility.location,
        imageUrl: editFacility.imageUrl,
      });
      console.log("Instalación actualizada correctamente");

      // Actualizar la instalación directamente en la lista de instalaciones en el estado local
      const updatedFacilities = facilities.map((facility) =>
        facility.id === editFacility.id
          ? { ...facility, availability: editFacility.availability }
          : facility
      );
      setFacilities(updatedFacilities);

      setEditFacility(null);
    } catch (error) {
      console.log("Error updating facility:", error);
    }
  };

  const handleChange = (e) => {
    if (editFacility) {
      setEditFacility({ ...editFacility, [e.target.name]: e.target.value });
    } else {
      setNewFacility({ ...newFacility, [e.target.name]: e.target.value });
    }
  };

  const handleEditButtonClick = (facility) => {
    setEditFacility(facility);
  };

  const handleCancelButtonClick = () => {
    setEditFacility(null);
  };

  return (
    <div className="container">
      <h2>{editFacility ? "Editar Instalación" : "Agregar Instalación"}</h2>
      <div>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editFacility ? editFacility.name : newFacility.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sport">Deporte:</label>
          <input
            type="text"
            id="sport"
            name="sport"
            value={editFacility ? editFacility.sport : newFacility.sport}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={
              editFacility ? editFacility.description : newFacility.description
            }
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="availability">Disponibilidad:</label>
          <select
            id="availability"
            name="availability"
            value={
              editFacility
                ? editFacility.availability.toString()
                : newFacility.availability.toString()
            }
            onChange={handleChange}
            className="form-control"
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacidad:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={editFacility ? editFacility.capacity : newFacility.capacity}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Ubicación:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={editFacility ? editFacility.location : newFacility.location}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">URL de la imagen:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={editFacility ? editFacility.imageUrl : newFacility.imageUrl}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          {editFacility ? (
            <div>
              <Button onClick={handleEditFacility} variant="primary">
                Guardar
              </Button>{" "}
              <Button onClick={handleCancelButtonClick} variant="secondary">
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddFacility}
              variant="primary"
              className="my-2"
            >
              Agregar
            </Button>
          )}
        </div>
      </div>
      <div className="container">
        <h2>Instalaciones Deportivas</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Deporte</th>
              <th>Descripción</th>
              <th>Disponibilidad</th>
              <th>Capacidad</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility) => (
              <tr key={facility.id}>
                <td>{facility.name}</td>
                <td>{facility.sport}</td>
                <td>{facility.description}</td>
                <td>
                  {facility.availability ? "Disponible" : "No disponible"}
                </td>
                <td>{facility.capacity}</td>
                <td>{facility.location}</td>
                <td>
                  <div className="d-flex justify-content-around align-items-center w-100">
                    <Button
                      onClick={() => handleEditButtonClick(facility)}
                      variant="primary mr-2 px-4 m-2"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteFacility(facility.id)}
                      variant="danger mr-2"
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
