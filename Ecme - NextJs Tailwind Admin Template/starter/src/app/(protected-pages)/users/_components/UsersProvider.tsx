'use client'

import { useEffect } from 'react'
import { useUsersStore, initialFilterData } from '../_store/usersStore'
import type { Users, Filter } from '../types'

type UsersProviderProps = {
    children: React.ReactNode
    userList: Users
    search?: string
    role?: string
    status?: string
}

const UsersProvider = ({
    children,
    userList,
    search,
    role,
    status,
}: UsersProviderProps) => {
    const setUserList = useUsersStore((state) => state.setUserList)
    const setFilterData = useUsersStore((state) => state.setFilterData)
    const setInitialLoading = useUsersStore((state) => state.setInitialLoading)

    useEffect(() => {
        const filterData: Filter = {
            ...initialFilterData,
            search: search || '',
            role: role || '',
            status: (status as 'active' | 'inactive') || 'active',
        }
        setFilterData(filterData)
        setUserList(userList)
        setInitialLoading(false)
    }, [userList, search, role, status, setUserList, setFilterData, setInitialLoading])

    return <>{children}</>
}

export default UsersProvider