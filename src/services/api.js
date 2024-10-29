// src/services/api.js
export const searchJobs = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Add search parameters if they exist
        if (params.q) queryParams.append('q', params.q);
        if (params.occupationField) queryParams.append('occupation-field', params.occupationField);
        if (params.occupationGroup) queryParams.append('occupation-group', params.occupationGroup);
        if (params.region) queryParams.append('region', params.region);
        if (params.municipality) queryParams.append('municipality', params.municipality);

        // Add limit parameter - API default is 10, max is 100
        queryParams.append('limit', '100');

        const response = await fetch(`https://links.api.jobtechdev.se/joblinks?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
}