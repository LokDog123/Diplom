import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useChildData = (childId) => {
    // Загрузка данных ребенка
    const childQuery = useQuery({
        queryKey: ['child', childId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/children/${childId}`);
            return response.data.child;
        },
        enabled: !!childId,
        staleTime: 5 * 60 * 1000, // 5 минут
    });

    // Загрузка замеров
    const measurementsQuery = useQuery({
        queryKey: ['measurements', childId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/measurements/child/${childId}`);
            return response.data.measurements;
        },
        enabled: !!childId,
        staleTime: 5 * 60 * 1000,
    });

    // Загрузка питания
    const feedingQuery = useQuery({
        queryKey: ['feeding', childId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/feeding/child/${childId}`);
            return response.data.feeding || [];
        },
        enabled: !!childId,
        staleTime: 5 * 60 * 1000,
    });

    // Загрузка здоровья
    const healthQuery = useQuery({
        queryKey: ['health', childId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/health/child/${childId}`);
            return response.data.health || [];
        },
        enabled: !!childId,
        staleTime: 5 * 60 * 1000,
    });

    const isLoading = childQuery.isLoading || measurementsQuery.isLoading;
    const isError = childQuery.isError || measurementsQuery.isError;
    const error = childQuery.error || measurementsQuery.error;

    return {
        child: childQuery.data,
        measurements: measurementsQuery.data || [],
        feeding: feedingQuery.data || [],
        health: healthQuery.data || [],
        isLoading,
        isError,
        error,
        refetchAll: () => {
            childQuery.refetch();
            measurementsQuery.refetch();
            feedingQuery.refetch();
            healthQuery.refetch();
        }
    };
};

export const useChildrenList = (parentId) => {
    return useQuery({
        queryKey: ['children', parentId],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/children/parent/${parentId}`);
            return response.data.children || [];
        },
        enabled: !!parentId,
        staleTime: 2 * 60 * 1000,
    });
};