import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./App.css";

import Inicio from "./components/Inicio";
import Filtro from "./components/Filtro";
import Prestamo from "./components/Prestamo";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Register from "./components/Register";

import { getFirestore, doc, getDoc } from "firebase/firestore";

async function checkAdminRole(userId) {
  const firestore = getFirestore();
  const userDocRef = doc(firestore, "users", userId);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    return userData.isAdmin === true;
  }

  return false;
}

function App() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isTopBarFixed, setIsTopBarFixed] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const isAdmin = await checkAdminRole(currentUser.uid);
        setUser({ ...currentUser, admin: isAdmin });
        setUserEmail(currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirigir al usuario a la página de inicio
      return <Navigate to="/" />;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsTopBarFixed(true);
      } else {
        setIsTopBarFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      {/* <!-- ======= Top Bar ======= --> */}
      <div
        className="d-flex justify-content-between align-items-center p-0 mt-0 mb-0"
        style={{ fontSize: "20px" }}
      >
        <div className="d-flex align-items-center" style={{ margin: "0 20px" }}>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center"></div>
            <div className="d-flex">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "15px", padding: "5px" }}
              >
                <FaFacebook size={30} className="icon" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "15px", padding: "5px" }}
              >
                <FaInstagram size={30} className="icon" />
              </a>
              <a
                href="https://www.twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "15px", padding: "5px" }}
              >
                <FaTwitter size={30} className="icon" />
              </a>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end p-0 ">
          {user ? (
            <NavDropdown title={userEmail} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleLogout}>
                CERRAR SESION
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Link to="/login" className="custom-link">
                INICIAR SESIÓN
              </Link>
              <Link to="/register" className="custom-link">
                REGISTRARSE
              </Link>
            </>
          )}
        </div>
      </div>
      {/* <!-- ======= Header ======= --> */}

      <Navbar collapseOnSelect expand="lg" className={`custom-navbar ${isTopBarFixed ? "fixed-top" : ""}`}>
        <Navbar.Brand href="/">
          <img
            src="https://bienestar.cuc.edu.co/wp-content/uploads/2024/04/Unicosta-CUC-Blanco.png"
            alt="Biblioteca CUC"
            className="navbar-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="d-flex justify-content-center"
        >
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              Noticias
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/filtro">
                  Buscar Instalaciones
                </Nav.Link>
                <Nav.Link as={Link} to="/prestamo">
                  Mis reservas de Instalaciones
                </Nav.Link>
                {user.admin && (
                  <Nav.Link as={Link} to="/admin">
                    Gestion de Instalaciones
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container ml-4 mr-4 mt-0">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Inicio />} />
              <Route path="/filtro" element={<Filtro />} />
              <Route path="/prestamo" element={<Prestamo />} />
              {user.admin && <Route path="/admin" element={<Admin />} />}
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
        <hr />
        <footer className="text-center text-lg-start bg-light text-muted">
          <section>
            <div className="container p-4">
              <div className="row mt-3">
                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Categorías</h6>
                  <p>
                    <a href="#!" className="text-reset">
                      Fútbol
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Baloncesto
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Natación
                    </a>
                  </p>
                </div>

                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Servicios</h6>
                  <p>
                    <a href="#!" className="text-reset">
                      Préstamo de instalaciones
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Reserva de canchas
                    </a>
                  </p>
                  <p>
                    <a href="#!" className="text-reset">
                      Eventos deportivos
                    </a>
                  </p>
                </div>

                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Contáctenos</h6>
                  <p>
                    <i className="fas fa-home me-3"></i> Calle 58 # 55 – 66
                  </p>
                  <p>
                    <i className="fas fa-envelope me-3"></i> info@biblioteca.com
                  </p>
                  <p>
                    <i className="fas fa-phone me-3"></i> +1 234 567 890
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center p-2">
            © Derechos de Autor: Unicosta - CUC
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
