'use server'

import { UpdateUserData } from '@/app/(protected-pages)/users/types'

export async function updateUser(userData: UpdateUserData) {
    try {
        // In a real app, you would get the JWT token from the session
        // For now, let's use a hardcoded token for testing
        const token = process.env.ADMIN_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZWNtZS5jb20iLCJwaG9uZU51bWJlciI6IisyMTg5MTEyMzQ1NjciLCJyb2xlcyI6WyJTWVNURU1fU1RBRkYiXSwiaWF0IjoxNzU4MDUxMDE3LCJleHAiOjE3NTgxMzc0MTd9.DEtQrpPpISkqEQ8DP0CEemkZ1AQYu8_brAv2j_RmT8A'
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        
        const updateData: any = {
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            isActive: userData.isActive,
            roles: userData.roles
        }

        // Only include password if provided
        if (userData.password) {
            updateData.passwordHash = userData.password
        }

        const response = await fetch(`${apiUrl}/users/${userData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to update user')
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}