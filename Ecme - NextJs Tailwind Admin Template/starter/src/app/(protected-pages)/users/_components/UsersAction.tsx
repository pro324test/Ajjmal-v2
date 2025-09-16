'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useUsersStore } from '../_store/usersStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '../constants'
import { TbSearch, TbPlus, TbFilter } from 'react-icons/tb'
import type { Filter } from '../types'

type RoleOption = {
    label: string
    value: string
}

type StatusOption = {
    label: string
    value: string
}

const UsersAction = () => {
    const filterData = useUsersStore((state) => state.filterData)
    const setFilterData = useUsersStore((state) => state.setFilterData)
    const setUserDialog = useUsersStore((state) => state.setUserDialog)
    
    const { onAppendQueryParams } = useAppendQueryParams()

    const [localSearch, setLocalSearch] = useState(filterData.search || '')

    const handleSearch = () => {
        const newFilter = { ...filterData, search: localSearch }
        setFilterData(newFilter)
        onAppendQueryParams({
            search: localSearch || '',
            page: '1', // Reset to first page when searching
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleRoleChange = (option: RoleOption | null) => {
        const value = option?.value || ''
        const newFilter = { ...filterData, role: value }
        setFilterData(newFilter)
        onAppendQueryParams({
            role: value || '',
            page: '1',
        })
    }

    const handleStatusChange = (option: StatusOption | null) => {
        const value = option?.value || ''
        const newFilter = { ...filterData, status: value as 'active' | 'inactive' }
        setFilterData(newFilter)
        onAppendQueryParams({
            status: value || '',
            page: '1',
        })
    }

    const handleClearFilters = () => {
        const clearedFilter: Filter = {
            search: '',
            role: '',
            status: 'active',
        }
        setFilterData(clearedFilter)
        setLocalSearch('')
        onAppendQueryParams({
            search: '',
            role: '',
            status: '',
            page: '1',
        })
    }

    const handleNewUser = () => {
        setUserDialog({ type: 'new', open: true })
    }

    const roleOptions: RoleOption[] = [
        { label: 'All Roles', value: '' },
        ...Object.entries(USER_ROLE_LABELS).map(([value, label]) => ({
            label,
            value,
        })),
    ]

    const statusOptions: StatusOption[] = [
        { label: 'All Status', value: '' },
        ...Object.entries(USER_STATUS_LABELS).map(([value, label]) => ({
            label,
            value,
        })),
    ]

    const hasActiveFilters = filterData.search || filterData.role || (filterData.status && filterData.status !== 'active')

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Input
                            placeholder="Search users..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-64 pl-10"
                        />
                        <TbSearch 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={handleSearch}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Select<RoleOption>
                        placeholder="Role"
                        value={roleOptions.find(option => option.value === filterData.role) || null}
                        options={roleOptions}
                        onChange={handleRoleChange}
                        className="w-40"
                    />
                    <Select<StatusOption>
                        placeholder="Status"
                        value={statusOptions.find(option => option.value === filterData.status) || null}
                        options={statusOptions}
                        onChange={handleStatusChange}
                        className="w-40"
                    />
                    {hasActiveFilters && (
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={handleClearFilters}
                            icon={<TbFilter />}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="solid"
                    onClick={handleNewUser}
                    icon={<TbPlus />}
                >
                    Add User
                </Button>
            </div>
        </div>
    )
}

export default UsersAction