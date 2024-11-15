// src/components/Lecturer/LecturerDashboard.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';

function LecturerDashboard() {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        axios.get('/api/lecturer/classes/', { headers: { Authorization: `Token ${localStorage.getItem('token')}` } })
            .then(response => setClasses(response.data))
            .catch(error => console.error('Error fetching classes:', error));
    }, []);

    return (
        <div>
            <h1>Lecturer Dashboard</h1>
            <h2>Your Classes</h2>
            <ul>
                {classes.map(classItem => (
                    <li key={classItem.id}>{classItem.course.name} - Class {classItem.number}</li>
                ))}
            </ul>
        </div>
    );
}

export default LecturerDashboard;
