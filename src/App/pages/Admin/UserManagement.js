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
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortDirection, setSortDirection] = useState('desc');
    
    const fetchUsers = async (pageNumber, search) => {
        try {
            const response = await axios.get(
                `http://localhost:8888/api/v1/user/user-list?page=${pageNumber}&size=${rowsPerPage}&searchTerm=${search || ''}&sortBy=createDate&sortDirection=${sortDirection}`, 
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

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        // Reset to first page when sorting changes
        setPage(0);
    };

    // Add this to your existing styles
    const styles = {
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        searchBox: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '300px'
        },
        searchInput: {
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '100%'
        },
        sortButton: {
            padding: '8px 12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    useEffect(() => {
        fetchUsers(page, debouncedSearchTerm);
    }, [page, debouncedSearchTerm, sortDirection]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box sx={{ p: 3 }}>
            <div style={styles.header}>
                    <Typography variant="h4" gutterBottom>
                        User Management
                    </Typography>
                    <div style={styles.searchBox}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button 
                            style={styles.sortButton}
                            onClick={toggleSortDirection}
                        >
                            Sort {sortDirection === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>

            </div>

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

// Debounce hook to prevent too many API calls
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue];
}

export default UserManagement;