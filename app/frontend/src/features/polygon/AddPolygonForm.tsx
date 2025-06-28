import React, { useState } from 'react'

interface AddPolygonFormProps {
    onSave: (name: string) => void
    onCancel: () => void
}

const AddPolygonForm: React.FC<AddPolygonFormProps> = ({ onSave, onCancel }) => {
    const [polygonName, setPolygonName] = useState('')

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (polygonName.trim()) {
            onSave(polygonName)
            setPolygonName('')
        } else {
            alert('Please enter a polygon name.')
        }
    }

    return (
        <div className="add-polygon-form-container">
            <h3>Name Your Polygon</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={polygonName}
                    onChange={(e) => setPolygonName(e.target.value)}
                    placeholder="Enter polygon name"
                />
                <button type="submit">Save Polygon</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>

            <style jsx>{`
                .add-polygon-form-container {
                    margin-top: 20px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fff;
                }
                h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #333;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                input[type='text'] {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }
                button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button[type='submit'] {
                    background-color: #28a745;
                    color: white;
                }
                button[type='submit']:hover {
                    background-color: #218838;
                }
                button[type='button'] {
                    background-color: #6c757d;
                    color: white;
                }
                button[type='button']:hover {
                    background-color: #5a6268;
                }
            `}</style>
        </div>
    )
}

export default AddPolygonForm
