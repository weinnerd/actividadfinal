import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';

function Prestamo() {
  const auth = getAuth();
  const [loanedFacilities, setLoanedFacilities] = useState([]);
  const [returnedFacilities, setReturnedFacilities] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchLoanedFacilities = async () => {
      const firestore = getFirestore();
      const facilitiesCollectionRef = collection(firestore, 'facilities');
      const userId = auth.currentUser.uid;
      const loanedFacilitiesQuery = query(facilitiesCollectionRef, where('loanedBy', '==', userId));
      const loanedFacilitiesSnapshot = await getDocs(loanedFacilitiesQuery);
      const loanedFacilitiesData = loanedFacilitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoanedFacilities(loanedFacilitiesData);
    };

    fetchLoanedFacilities();
  }, [auth.currentUser]);

  const handleReturnFacility = async (facilityId) => {
    const firestore = getFirestore();
    const facilityRef = doc(firestore, 'facilities', facilityId);

    try {
      await updateDoc(facilityRef, {
        loanedBy: '',
        availability: true,
      });

      const returnedFacility = loanedFacilities.find((facility) => facility.id === facilityId);
      setReturnedFacilities((prevReturnedFacilities) => [...prevReturnedFacilities, returnedFacility]);

      setLoanedFacilities((prevLoanedFacilities) => prevLoanedFacilities.filter((facility) => facility.id !== facilityId));

      console.log('Instalación devuelta con éxito');
      setShowSuccessMessage(true);
    } catch (error) {
      console.log('Error al devolver la instalación:', error);
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      swal({
        title: 'Instalación devuelta con éxito',
        icon: 'success',
        timer: 3000,
      }).then(() => {
        setShowSuccessMessage(false);
      });
    }
  }, [showSuccessMessage]);

  return (
    <div className="container-sm w-50">
      <h2>Préstamo/Devolución de Instalaciones Deportivas</h2>

      {loanedFacilities.length > 0 ? (
        <>
          <h3>Instalaciones en préstamo:</h3>
          <ul className="list-group">
            {loanedFacilities.map((facility) => (
              <li key={facility.id} className="list-group-item d-flex justify-content-between align-items-center">
                {facility.name}
                <button className="btn btn-danger" onClick={() => handleReturnFacility(facility.id)}>
                  Devolver
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No tienes instalaciones en préstamo.</p>
      )}

      {returnedFacilities.length > 0 ? (
        <>
          <h3>Instalaciones devueltas recientemente:</h3>
          <ul className="list-group">
            {returnedFacilities.map((facility) => (
              <li key={facility.id} className="list-group-item">
                {facility.name}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {showSuccessMessage && (
        <div className="alert alert-success" role="alert">
          Instalación devuelta con éxito
        </div>
      )}
    </div>
  );
}

export default Prestamo;
