import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TablePagination
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async (pageNumber) => {
        try {
            const response = await axios.get(
                `http://localhost:8888/api/v1/user/user-list?page=${pageNumber}&size=${rowsPerPage}`, 
                {
                    headers: {
                        'Authorization': `${Cookies.get('its-cms-accessToken')}`
                    }
                }
            );
            setUsers(response.data.data.content);
            setTotalElements(response.data.data.totalElements);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.status ? 'Active' : 'Inactive'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </TableContainer>
        </Box>
    );
};

export default UserManagement;