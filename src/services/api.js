const API_BASE_URL = 'https://links.api.jobtechdev.se';

/**
 * Transforms the raw job data into a consistent format
 */
const transformJobData = (job) => ({
    id: job.id,
    title: job.headline,
    description: job.description?.text || 'No description available',
    company: job.employer?.name || 'Company not specified',
    location: job.workplace_address?.municipality || 'Location not specified',
    occupation: job.occupation?.label || 'Occupation not specified',
    publishedAt: job.publication_date,
    applicationDeadline: job.application_deadline,
    employmentType: job.employment_type?.label || 'Not specified',
    url: job.application_details?.url || null,
    sourceType: job.source_type
});

/**
 * Fetches job listings with optional search parameters
 */
export const fetchJobs = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Add search term if provided
        if (params.q) {
            queryParams.append('q', params.q);
        }

        // Add occupation field if provided
        if (params.occupationField) {
            queryParams.append('occupation-field', params.occupationField);
        }

        // Add location if provided
        if (params.location) {
            queryParams.append('municipality', params.location);
        }

        const response = await fetch(
            `${API_BASE_URL}/joblinks?${queryParams.toString()}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            total: data.total?.value || 0,
            jobs: (data.hits || []).map(transformJobData)
        };
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

/**
 * Fetches a single job by ID
 */
export const fetchJobById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ad/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return transformJobData(data);
    } catch (error) {
        console.error('Error fetching job details:', error);
        throw error;
    }
};