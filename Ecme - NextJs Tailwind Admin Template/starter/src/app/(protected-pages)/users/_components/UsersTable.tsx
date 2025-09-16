'use client'

import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Dropdown from '@/components/ui/Dropdown'
import DataTable from '@/components/shared/DataTable'
import { useUsersStore } from '../_store/usersStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import dayjs from 'dayjs'
import { TbDots } from 'react-icons/tb'
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '../constants'
import type { User } from '../types'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'

type UsersTableProps = {
    userListTotal?: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const roleColor: Record<string, string> = {
    SYSTEM_STAFF: 'bg-purple-200 dark:bg-purple-200 text-gray-900 dark:text-gray-900',
    CUSTOMER: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    VENDOR: 'bg-green-200 dark:bg-green-200 text-gray-900 dark:text-gray-900',
    DELIVERY_PERSON: 'bg-orange-200 dark:bg-orange-200 text-gray-900 dark:text-gray-900',
}

const UsersTable = (props: UsersTableProps) => {
    const { userListTotal = 0, pageIndex = 1, pageSize = 10 } = props

    const initialLoading = useUsersStore((state) => state.initialLoading)
    const userList = useUsersStore((state) => state.userList)
    const setSelectAllUser = useUsersStore((state) => state.setSelectAllUser)
    const setUserDialog = useUsersStore((state) => state.setUserDialog)

    const { onAppendQueryParams } = useAppendQueryParams()

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            pageSize: String(value),
            pageIndex: '1',
        })
    }

    const handleSort = (sort: OnSortParam) => {
        onAppendQueryParams({
            sort: sort.key,
            order: sort.order,
        })
    }

    const handleRowSelect = (checked: boolean, row: User) => {
        const setSelectedUser = useUsersStore.getState().setSelectedUser
        setSelectedUser(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<User>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllUser(originalRows)
        } else {
            setSelectAllUser([])
        }
    }

    const handleEdit = (user: User) => {
        setUserDialog({ type: 'edit', open: true })
        // You would set the user to edit here
        console.log('Edit user:', user.id)
    }

    const handleDelete = (user: User) => {
        // Handle delete logic
        console.log('Delete user:', user.id)
    }

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'User',
                accessorKey: 'fullName',
                cell: (props) => {
                    const { fullName, email, phoneNumber } = props.row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar shape="circle" size={30}>
                                {fullName.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                                <div className="font-semibold">{fullName}</div>
                                <div className="text-xs opacity-60">
                                    {email || phoneNumber}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Contact',
                accessorKey: 'phoneNumber',
                cell: (props) => {
                    const { email, phoneNumber } = props.row.original
                    return (
                        <div>
                            <div>{phoneNumber}</div>
                            {email && (
                                <div className="text-xs opacity-60">{email}</div>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Roles',
                accessorKey: 'roles',
                cell: (props) => {
                    const { roles } = props.row.original
                    const activeRoles = roles.filter(role => role.isActive)
                    const primaryRole = activeRoles.find(role => role.isPrimary) || activeRoles[0]
                    
                    return (
                        <div className="flex flex-wrap gap-1">
                            {primaryRole && (
                                <Tag className={roleColor[primaryRole.role]}>
                                    {USER_ROLE_LABELS[primaryRole.role as keyof typeof USER_ROLE_LABELS]}
                                    {primaryRole.isPrimary && ' (Primary)'}
                                </Tag>
                            )}
                            {activeRoles.length > 1 && (
                                <span className="text-xs opacity-60">
                                    +{activeRoles.length - 1} more
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const { isActive } = props.row.original
                    const status = isActive ? 'active' : 'inactive'
                    return (
                        <Tag className={statusColor[status]}>
                            {USER_STATUS_LABELS[status as keyof typeof USER_STATUS_LABELS]}
                        </Tag>
                    )
                },
            },
            {
                header: 'Last Login',
                accessorKey: 'lastLoginAt',
                cell: (props) => {
                    const { lastLoginAt } = props.row.original
                    return lastLoginAt ? (
                        <div>
                            <div>{dayjs(lastLoginAt).format('MMM DD, YYYY')}</div>
                            <div className="text-xs opacity-60">
                                {dayjs(lastLoginAt).format('hh:mm A')}
                            </div>
                        </div>
                    ) : (
                        <span className="opacity-60">Never</span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const user = props.row.original
                    return (
                        <Dropdown
                            renderTitle={
                                <TbDots className="text-lg cursor-pointer select-none" />
                            }
                        >
                            <Dropdown.Item
                                eventKey="edit"
                                onSelect={() => handleEdit(user)}
                            >
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                                eventKey="delete"
                                onSelect={() => handleDelete(user)}
                            >
                                Delete
                            </Dropdown.Item>
                        </Dropdown>
                    )
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setUserDialog]
    )

    return (
        <DataTable
            selectable
            columns={columns}
            data={userList}
            loading={initialLoading}
            pagingData={{
                total: userListTotal,
                pageIndex,
                pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default UsersTable