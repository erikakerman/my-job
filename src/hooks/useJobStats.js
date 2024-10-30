import { useState, useEffect } from 'react';
import { searchJobs } from '../services/api';

const useJobStats = () => {
    const [data, setData] = useState({
        isLoading: true,
        error: null,
        stats: {
            total: 0
        },
        weeklyTrends: [],
        rawJobs: [],
        categories: {
            occupationGroups: [],
            jobTitles: []
        }
    });

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const response = await searchJobs({
                    'occupation-field': 'apaJ_2ja_LuF',  // Data/IT field
                    limit: 1000  // Increased from 100 to 1000
                });

                const jobs = response.hits || [];

                // Collect unique occupation groups and titles
                const occupationGroups = [...new Set(jobs.map(job =>
                    job['occupation-group']?.label
                ).filter(Boolean))].sort();

                const jobTitles = [...new Set(jobs.map(job =>
                    job.headline
                ).filter(Boolean))].sort();

                // Create weekly trends data
                const weeklyData = jobs.reduce((acc, job) => {
                    const date = new Date(job.publication_date);
                    const weekStart = getWeekStart(date);
                    const weekKey = weekStart.toISOString();

                    if (!acc[weekKey]) {
                        acc[weekKey] = {
                            weekStart,
                            weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
                            count: 0
                        };
                    }
                    acc[weekKey].count++;
                    return acc;
                }, {});

                const weeklyTrends = Object.values(weeklyData)
                    .sort((a, b) => a.weekStart - b.weekStart)
                    .map(week => ({
                        ...week,
                        dateRange: `${formatDate(week.weekStart)} - ${formatDate(week.weekEnd)}`
                    }));

                setData({
                    isLoading: false,
                    error: null,
                    stats: {
                        total: jobs.length
                    },
                    weeklyTrends,
                    rawJobs: jobs,
                    categories: {
                        occupationGroups,
                        jobTitles: jobTitles.slice(0, 20) // First 20 titles for now
                    }
                });

                // Log for analysis
                console.log('Occupation Groups:', occupationGroups);
                console.log('Sample Job Titles:', jobTitles.slice(0, 20));
                console.log('Total Jobs:', jobs.length);
                console.log('Sample Jobs:', jobs.slice(0, 5).map(job => ({
                    title: job.headline,
                    group: job['occupation-group']?.label,
                    field: job['occupation-field']?.label
                })));

            } catch (error) {
                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message
                }));
                console.error('Error:', error);
            }
        };

        fetchJobData();
    }, []);

    // Helper function to get week start date
    const getWeekStart = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        newDate.setDate(newDate.getDate() - newDate.getDay());
        return newDate;
    };

    // Helper function to format dates
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return data;
};

export default useJobStats;