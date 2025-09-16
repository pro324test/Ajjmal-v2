import type { KeyedMutator } from 'swr'

export type User = {
    id: string
    fullName: string
    email?: string
    phoneNumber: string
    roles: Array<{
        role: string
        isActive: boolean
        isPrimary: boolean
    }>
    isActive: boolean
    lastLoginAt?: string
    createdAt: string
    updatedAt: string
}

export type Filter = {
    role?: string
    status?: 'active' | 'inactive'
    search?: string
}

export type Users = User[]

export type GetUsersResponse = {
    users: Users
    pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
}

export type MutateUsersResponse = KeyedMutator<GetUsersResponse>

export type CreateUserData = {
    fullName: string
    email?: string
    phoneNumber: string
    password: string
    roles: Array<{
        role: string
        isActive: boolean
        isPrimary: boolean
    }>
    isActive: boolean
}

export type UpdateUserData = Partial<CreateUserData> & {
    id: string
}