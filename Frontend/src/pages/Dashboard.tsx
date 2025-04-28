import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { RootState } from '../store';
import api from '../utils/api';
import { DashboardData } from '../types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/api/dashboard/user');
        setDashboardData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const gridItems = [
    {
      title: 'Total Books',
      value: dashboardData?.totalBooks || 0,
      color: 'textSecondary',
    },
    {
      title: 'Currently Borrowed',
      value: dashboardData?.totalBorrowed || 0,
      color: 'textSecondary',
    },
    {
      title: 'Overdue Returns',
      value: dashboardData?.overdueReturns || 0,
      color: 'error',
    },
    {
      title: 'Total Returned',
      value: dashboardData?.returned || 0,
      color: 'textSecondary',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Grid container spacing={3}>
        {gridItems.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color={item.color} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h5" color={item.color === 'error' ? 'error' : undefined}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 