'use server'
import type { SignInCredential } from '@/@types/auth'

const validateCredential = async (values: SignInCredential) => {
    /** Connect to the backend API for authentication */
    const { email, password } = values
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    try {
        const response = await fetch(`${backendUrl}/auth/validate-credential`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            return null
        }

        const user = await response.json()
        return user
    } catch (error) {
        console.error('Authentication error:', error)
        return null
    }
}

export default validateCredential
