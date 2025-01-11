import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        allergens: '',
        image: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`https://localhost:7238/api/recipes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load recipe.');
            }
        };
        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('ingredients', formData.ingredients);
        formDataToSend.append('instructions', formData.instructions);
        formDataToSend.append('allergens', formData.allergens);
        if (formData.image) formDataToSend.append('image', formData.image);

        try {
            await axios.put(`https://localhost:7238/api/recipes/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Recipe updated successfully!');
            navigate('/my-recipes');
        } catch (err) {
            setError('Failed to update recipe.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Edit Recipe</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Recipe Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="ingredients"
                    placeholder="Ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="instructions"
                    placeholder="Instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="allergens"
                    placeholder="Allergens"
                    value={formData.allergens}
                    onChange={handleChange}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default EditRecipe;
