import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Button, Container } from "react-bootstrap";
import Banner from "./Banner";
import "./Inicio.css";
import swal from "sweetalert";

function Inicio() {
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();

    const fetchAvailableFacilities = async () => {
      const facilitiesCollectionRef = collection(firestore, "facilities");
      const availableFacilitiesQuery = query(
        facilitiesCollectionRef,
        where("availability", "==", true)
      );
      const availableFacilitiesSnapshot = await getDocs(
        availableFacilitiesQuery
      );
      const availableFacilitiesData = availableFacilitiesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() })
      );
      setAvailableFacilities(availableFacilitiesData);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    fetchAvailableFacilities();

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoanFacility = async (facilityId) => {
    if (currentUser) {
      const firestore = getFirestore();
      const facilityRef = doc(firestore, "facilities", facilityId);
      await updateDoc(facilityRef, {
        availability: false,
        loanedBy: currentUser.uid,
      });
      console.log("Instalación deportiva prestada:", facilityId);
      setShowSuccessMessage(true);

      // Actualizar el estado de availableFacilities después de prestar la instalación
      setAvailableFacilities((prevFacilities) =>
        prevFacilities.filter((facility) => facility.id !== facilityId)
      );
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      swal({
        title: "Instalación deportiva prestada con éxito",
        icon: "success",
        timer: 3000,
      }).then(() => {
        setShowSuccessMessage(false);
      });
    }
  }, [showSuccessMessage]);

  return (
    <div>
      <div className="banner-container">
        <Banner />
      </div>

      <Container fluid>
        <p className="welcome-message">
          La Coordinación de Deporte propende por el mejoramiento de las
          cualidades físicas, intelectuales y ciudadanas de la comunidad
          universitaria, generando un equilibrio entre mente-cuerpo y logrando
          un mejor rendimiento en las actividades cotidianas, al interiorizar
          valores como la disciplina, tolerancia, autonomía y respeto. En un
          proceso de fortalecimiento continuo, se ha venido incrementando la
          oferta de las diferentes actividades deportivas, recreativas,
          competitivas, formativas y el uso adecuado del tiempo.
        </p>
        <h1 className="h1">
          Cuenta con las siguientes instalaciones deportivas
        </h1>
        <Row xs={1} md={4} className="g-6">
          {availableFacilities.map((facility) => (
            <Col key={facility.id}>
              <Card className="book-card">
                {facility.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={facility.imageUrl}
                    className="card-img"
                  />
                )}
                <Card.Body>
                  <Card.Title>{facility.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Deporte: {facility.sport}
                  </Card.Subtitle>
                  <Card.Text>Descripción: {facility.description}</Card.Text>
                  <Card.Text>
                    Disponibilidad:{" "}
                    {facility.availability ? "Disponible" : "No disponible"}
                  </Card.Text>
                  <Card.Text>Capacidad: {facility.capacity}</Card.Text>
                  <Card.Text>Ubicación: {facility.location}</Card.Text>
                  <div className="card-buttons">
                    {facility.availability && currentUser && (
                      <Button
                        onClick={() => handleLoanFacility(facility.id)}
                        variant="primary"
                      >
                        PRESTAR INSTALACIÓN
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <hr />

        <div className="newsletter">
          <h3>Boletín de Noticias</h3>
          <p>¡Mantente al día con nuestras últimas novedades y eventos!</p>
          <form className="row g-3">
            <div className="col-auto">
              <input
                type="email"
                className="form-control"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Suscribirse
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Inicio;
