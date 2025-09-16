import Container from '@/components/shared/Container'
import UsersAction from './_components/UsersAction'
import UsersTable from './_components/UsersTable'
import UsersProvider from './_components/UsersProvider'
import UserDialog from './_components/UserDialog'
import getUsers from '@/server/actions/users/getUsers'
import type { PageProps } from '@/@types/common'

export default async function UsersPage({ searchParams }: PageProps) {
    const params = await searchParams

    // Convert params to proper format for getUsers
    const userListParams: Record<string, string> = {}
    if (params.search && typeof params.search === 'string') {
        userListParams.search = params.search
    }
    if (params.role && typeof params.role === 'string') {
        userListParams.role = params.role
    }
    if (params.status && typeof params.status === 'string') {
        userListParams.status = params.status
    }
    if (params.page && typeof params.page === 'string') {
        userListParams.page = params.page
    }
    if (params.pageSize && typeof params.pageSize === 'string') {
        userListParams.pageSize = params.pageSize
    }
    if (params.sort && typeof params.sort === 'string') {
        userListParams.sort = params.sort
    }
    if (params.order && typeof params.order === 'string') {
        userListParams.order = params.order
    }

    const userList = await getUsers(userListParams)

    return (
        <UsersProvider
            userList={userList.users}
            search={params.search as string}
            role={params.role as string}
            status={params.status as string}
        >
            <Container>
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3>User Management</h3>
                    </div>
                </div>
                <div>
                    <div className="mb-6">
                        <UsersAction />
                    </div>
                    <UsersTable
                        userListTotal={userList.pagination.total}
                        pageIndex={userList.pagination.page}
                        pageSize={userList.pagination.pageSize}
                    />
                </div>
            </Container>
            
            {/* Dialog Components */}
            <UserDialog />
        </UsersProvider>
    )
}