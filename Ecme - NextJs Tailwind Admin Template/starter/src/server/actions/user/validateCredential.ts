'use server'
import type { SignInCredential } from '@/@types/auth'
import { signInUserData } from '@/mock/data/authData'

const validateCredential = async (values: SignInCredential) => {
    /** For starter template, use mock data instead of backend API */
    const { email, password } = values

    try {
        // Find user in mock data
        const user = signInUserData.find(
            (userData) => userData.email === email && userData.password === password
        )

        if (!user) {
            return null
        }

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    } catch (error) {
        console.error('Authentication error:', error)
        return null
    }
}

export default validateCredential
