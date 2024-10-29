// src/hooks/useJobs.js
import { useState, useEffect } from 'react';
import { fetchJobs } from '../services/api';

export const useJobs = (initialParams = {}) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalJobs, setTotalJobs] = useState(0);

    const loadJobs = async (params) => {
        try {
            setLoading(true);
            setError(null);
            const { jobs: fetchedJobs, total } = await fetchJobs(params);
            setJobs(fetchedJobs);
            setTotalJobs(total);
        } catch {  // No parameter needed if we're not using the error
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs(initialParams);
    }, [initialParams]);

    return {
        jobs,
        loading,
        error,
        totalJobs,
        refreshJobs: loadJobs
    };
};