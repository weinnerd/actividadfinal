import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "./Login.css";
import swal from "sweetalert";
import { useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVariant] = useState("");
  const [alertMessage] = useState("");

  useEffect(() => {
    // Desactivar el scroll al montar el componente
    document.body.style.overflow = "hidden";

    // Limpiar al desmontar el componente
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    // Verificar si el usuario está registrado
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length === 0) {
      swal("No estás registrado. Por favor, regístrate.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Inicio de sesión exitoso
      console.log("Inicio de sesión exitoso:", user);

      // Guardar datos del usuario en Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        // Agrega cualquier otro dato que desees guardar
      });

      console.log("Datos del usuario guardados en Firestore");
    } catch (error) {
      // Manejo de errores
      console.log("Error en el inicio de sesión:", error);
      swal("Contraseña incorrecta. Por favor, verifique sus credenciales.");
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // Inicio de sesión con Google exitoso
      console.log("Inicio de sesión con Google exitoso:", user);

      // Guardar datos del usuario en Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        isAdmin: false,
        roles: ["user"],
        uid: user.uid,
      });

      console.log("Datos del usuario guardados en Firestore");
    } catch (error) {
      // Manejo de errores
      console.log("Error en el inicio de sesión con Google:", error);
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Iniciar Sesión
        </button>
        <button
          type="button"
          className="btn btn-google"
          onClick={handleGoogleLogin}
        >
          <FaGoogle className="mr-2" /> Iniciar Sesión con Google
        </button>
        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>.
        </p>
      </form>
    </div>
  );
}

export default Login;
