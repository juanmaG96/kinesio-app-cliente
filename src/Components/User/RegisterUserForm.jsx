import React, { useState } from 'react';
import styles from '../auth/LoginForm.module.css';

function RegisterUserForm({ onRegister, onBackToLogin }) {
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Evita que la página se recargue
        onRegister({ dni, nombre, apellido, email, password });
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>Registrarse</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="DNI"
                    required
                />
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Apellido"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo Electrónico"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit" className={styles.submitButton}>Registrarse</button>
            </form>
        <p
            onClick={onBackToLogin}
            style={{cursor: 'pointer', color: 'var(--primary-color)', textAlign: 'center', marginTop: '1rem'}}
            >
             ← Volver al iniciar de sesión
            </p>
        </div>
    );
}

export default RegisterUserForm;