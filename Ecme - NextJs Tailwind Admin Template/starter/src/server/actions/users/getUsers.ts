'use server'

import type { GetUsersResponse } from '@/app/(protected-pages)/users/types'

const getUsers = async (filters?: Record<string, string>): Promise<GetUsersResponse> => {
    try {
        // In a real app, you would get the JWT token from the session
        // For now, let's use a hardcoded token for testing
        const token = process.env.ADMIN_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZWNtZS5jb20iLCJwaG9uZU51bWJlciI6IisyMTg5MTEyMzQ1NjciLCJyb2xlcyI6WyJTWVNURU1fU1RBRkYiXSwiaWF0IjoxNzU4MDUxMDE3LCJleHAiOjE3NTgxMzc0MTd9.DEtQrpPpISkqEQ8DP0CEemkZ1AQYu8_brAv2j_RmT8A'
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        
        // Build query parameters
        const params = new URLSearchParams()
        if (filters?.page) params.append('page', filters.page)
        if (filters?.pageSize) params.append('pageSize', filters.pageSize)
        if (filters?.search) params.append('search', filters.search)
        if (filters?.role) params.append('role', filters.role)
        if (filters?.status) params.append('status', filters.status)
        
        const url = `${apiUrl}/users?${params.toString()}`
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store', // Disable caching for real-time data
        })

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`)
        }

        const data = await response.json()
        
        // Transform the backend response to match the frontend interface
        return {
            users: data.users.map((user: any) => ({
                id: String(user.id), // Convert to string to match frontend type
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                roles: user.roles.map((role: any) => ({
                    role: role.role,
                    isActive: role.isActive,
                    isPrimary: role.isPrimary
                })),
                isActive: user.isActive,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
            pagination: data.pagination
        }
    } catch (error) {
        console.error('Error fetching users:', error)
        
        // Fallback to mock data in case of error for development
        const mockUsers = [
            {
                id: '1',
                fullName: 'System Administrator',
                email: 'admin@ecme.com',
                phoneNumber: '+218911234567',
                roles: [
                    {
                        role: 'SYSTEM_STAFF',
                        isActive: true,
                        isPrimary: true,
                    }
                ],
                isActive: true,
                lastLoginAt: '2024-01-15T10:30:00Z',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-15T10:30:00Z',
            },
            {
                id: '2',
                fullName: 'Angelina Gotelli',
                email: 'admin-01@ecme.com',
                phoneNumber: '+218911234568',
                roles: [
                    {
                        role: 'CUSTOMER',
                        isActive: true,
                        isPrimary: true,
                    }
                ],
                isActive: true,
                lastLoginAt: '2024-01-11T11:00:00Z',
                createdAt: '2024-01-05T00:00:00Z',
                updatedAt: '2024-01-11T11:00:00Z',
            },
        ]

        let filteredUsers = [...mockUsers]

        // Apply filters to mock data
        if (filters?.search) {
            const search = filters.search.toLowerCase()
            filteredUsers = filteredUsers.filter(user => 
                user.fullName.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.phoneNumber.includes(search)
            )
        }

        if (filters?.role) {
            filteredUsers = filteredUsers.filter(user =>
                user.roles.some(role => role.role === filters.role && role.isActive)
            )
        }

        if (filters?.status) {
            const isActive = filters.status === 'active'
            filteredUsers = filteredUsers.filter(user => user.isActive === isActive)
        }

        // Pagination for mock data
        const page = parseInt(filters?.page || '1')
        const pageSize = parseInt(filters?.pageSize || '10')
        const total = filteredUsers.length
        const totalPages = Math.ceil(total / pageSize)
        
        const startIndex = (page - 1) * pageSize
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

        return {
            users: paginatedUsers,
            pagination: {
                page,
                pageSize,
                total,
                totalPages,
            },
        }
    }
}

export default getUsers