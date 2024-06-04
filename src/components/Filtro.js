import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function Filtro() {
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const firestore = getFirestore();
        const facilitiesCollection = collection(firestore, 'facilities');
        const facilitiesSnapshot = await getDocs(facilitiesCollection);
        const facilitiesData = facilitiesSnapshot.docs.map((doc) => doc.data());
        setFacilities(facilitiesData);
      } catch (error) {
        console.log('Error fetching facilities:', error);
      }
    };

    fetchFacilities();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    const handleSearch = () => {
      const filtered = facilities.filter((facility) =>
        facility.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFacilities(filtered);
    };

    handleSearch();
  }, [searchQuery, facilities]);

  return (
    <div className="container">
      <h2>Buscar Instalaciones Deportivas</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {filteredFacilities.length > 0 ? (
        <div>
          <h3>Resultados de búsqueda:</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Deporte</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((facility, index) => (
                <tr key={index}>
                  <td>{facility.name}</td>
                  <td>{facility.sport}</td>
                  <td>{facility.availability ? 'Disponible' : 'No disponible'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron resultados</p>
      )}
    </div>
  );
}

export default Filtro;
