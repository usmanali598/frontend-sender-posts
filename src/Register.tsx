import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({ name: "", email: "" })
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    let navigate = useNavigate();

    const formValues = ((e: any) => {
        e.preventDefault();
        let { name, email } = formData;
        let emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
        if (emailRegex.test(email) && (name.length > 0 && /^[A-Za-z ]+$/.test(name))) {
            setError(false);
            fetch('https://api.supermetrics.com/assignment/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ client_id: 'ju16a6m81mhid5ue1z3v2g0uh', email: formData.email, name: formData.name })
            })
                .then(response => response.json())
                .then(data => {
                    navigate(`/posts?token=${data.data.sl_token}`);
                })
                .catch(err => console.log(err.message))
        } else {
            setError(true);
        }
    })

    return (
        <article>
            <section className="email-block">
                <h1 className='email-head'>LOGIN</h1>
                <form action="">
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' onChange={handleChange} />
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' onChange={handleChange} />
                    <p className={error ? 'formDanger' : 'none'}>Please, check if name and email is correct</p>
                    <button className="email-button" onClick={formValues}>GO</button>
                </form>
            </section>
        </article>
    )
}

export default Register;