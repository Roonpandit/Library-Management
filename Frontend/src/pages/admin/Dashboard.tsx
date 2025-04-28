import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People,
  LibraryBooks,
  Warning,
  Block,
  AssignmentReturn,
} from '@mui/icons-material';
import { AdminDashboardData } from '../../types';
import api from '../../utils/api';
import Users from './Users';
import Books from './Books';
import OverduePayments from './OverduePayments';
import BlockedUsers from './BlockedUsers';
import ReturnedBooks from './ReturnedBooks';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/api/dashboard/admin');
      setDashboardData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      text: 'Active Users',
      icon: <People />,
      value: dashboardData?.activeUsers || 0,
      path: 'users',
    },
    {
      text: 'Books',
      icon: <LibraryBooks />,
      value: dashboardData?.totalBooks || 0,
      path: 'books',
    },
    {
      text: 'Overdue Payments',
      icon: <Warning />,
      value: dashboardData?.overduePayments || 0,
      path: 'overdue-payments',
    },
    {
      text: 'Blocked Users',
      icon: <Block />,
      value: dashboardData?.blockedUsers || 0,
      path: 'blocked-users',
    },
    {
      text: 'Returned Books',
      icon: <AssignmentReturn />,
      value: dashboardData?.returnedBooks || 0,
      path: 'returned-books',
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Menu
              </Typography>
              <List>
                {menuItems.map((item, index) => (
                  <Box key={item.path}>
                    {index > 0 && <Divider />}
                    <ListItem onClick={() => navigate(item.path)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={`Total: ${item.value}`}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Routes>
            <Route path="users" element={<Users />} />
            <Route path="books" element={<Books />} />
            <Route path="overdue-payments" element={<OverduePayments />} />
            <Route path="blocked-users" element={<BlockedUsers />} />
            <Route path="returned-books" element={<ReturnedBooks />} />
            <Route
              path="/"
              element={
                <Typography variant="h5" sx={{ p: 3 }}>
                  Select a menu item to view details
                </Typography>
              }
            />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
} 