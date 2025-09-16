'use server'

import type { GetUsersResponse } from '@/app/(protected-pages)/users/types'

// For now, we'll use mock data. Later this will call the backend API
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
        lastLoginAt: '2024-01-14T15:45:00Z',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-14T15:45:00Z',
    },
    {
        id: '3',
        fullName: 'Ahmed Ali (Vendor)',
        email: 'vendor@ecme.com',
        phoneNumber: '+218911234569',
        roles: [
            {
                role: 'VENDOR',
                isActive: true,
                isPrimary: true,
            }
        ],
        isActive: true,
        lastLoginAt: '2024-01-13T09:20:00Z',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-13T09:20:00Z',
    },
    {
        id: '4',
        fullName: 'Omar Hassan (Delivery)',
        email: 'delivery@ecme.com',
        phoneNumber: '+218911234570',
        roles: [
            {
                role: 'DELIVERY_PERSON',
                isActive: true,
                isPrimary: true,
            }
        ],
        isActive: true,
        lastLoginAt: '2024-01-12T14:10:00Z',
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-12T14:10:00Z',
    },
    {
        id: '5',
        fullName: 'Sara Mohamed (Multi-Role)',
        email: 'multi@ecme.com',
        phoneNumber: '+218911234571',
        roles: [
            {
                role: 'CUSTOMER',
                isActive: true,
                isPrimary: true,
            },
            {
                role: 'VENDOR',
                isActive: true,
                isPrimary: false,
            }
        ],
        isActive: true,
        lastLoginAt: '2024-01-11T11:00:00Z',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-11T11:00:00Z',
    },
]

const getUsers = async (filters?: Record<string, string>): Promise<GetUsersResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    let filteredUsers = [...mockUsers]

    // Apply filters
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

    // Pagination
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

export default getUsers