'use server'
import type { SignInCredential } from '@/@types/auth'

const validateCredential = async (values: SignInCredential) => {
    const { email, password } = values

    try {
        // Call our NestJS backend API
        const response = await fetch(`${process.env.BACKEND_API_URL || 'http://localhost:3000'}/auth/validate-credential`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            return null // Invalid credentials
        }

        const user = await response.json()
        
        // Transform backend response to match frontend expectations
        return {
            id: user.id,
            avatar: user.avatar || '/img/avatars/thumb-1.jpg', // Default avatar
            userName: user.userName,
            email: user.email,
            authority: user.roles.map((role: string) => role.toLowerCase()), // Transform roles to lowercase
            password: password, // Don't expose real password
            accountUserName: user.userName.split(' ')[0].toLowerCase(), // First name as username
        }
    } catch (error) {
        console.error('Authentication error:', error)
        return null // Authentication failed
    }
}

export default validateCredential
