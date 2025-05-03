import React from 'react';
import { useRouter } from 'next/router';

const ClientProfile = () => {
    const router = useRouter();
    const { clientId } = router.query;

    // Fetch client data based on clientId (this is a placeholder for actual data fetching logic)
    const clientData = {
        id: clientId,
        name: 'Client Name',
        email: 'client@example.com',
        phone: '123-456-7890',
    };

    return (
        <div>
            <h1>Client Profile</h1>
            <p>ID: {clientData.id}</p>
            <p>Name: {clientData.name}</p>
            <p>Email: {clientData.email}</p>
            <p>Phone: {clientData.phone}</p>
        </div>
    );
};

export default ClientProfile;
