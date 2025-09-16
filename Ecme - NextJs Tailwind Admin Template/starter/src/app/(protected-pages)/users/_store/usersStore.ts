import { create } from 'zustand'
import type { User, Users, Filter } from '../types'

type Dialog = {
    type: '' | 'edit' | 'new'
    open: boolean
}

export const initialFilterData: Filter = {
    status: 'active',
    role: '',
    search: '',
}

export type UsersState = {
    userList: Users
    filterData: Filter
    selectedUser: Users
    userDialog: Dialog
    initialLoading: boolean
}

type UsersAction = {
    setFilterData: (payload: Filter) => void
    setSelectedUser: (checked: boolean, user: User) => void
    setSelectAllUser: (payload: Users) => void
    setUserDialog: (payload: Dialog) => void
    setUserList: (payload: Users) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: UsersState = {
    userList: [],
    filterData: initialFilterData,
    selectedUser: [],
    userDialog: {
        type: '',
        open: false,
    },
    initialLoading: true,
}

export const useUsersStore = create<UsersState & UsersAction>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedUser: (checked, user) =>
        set((state) => {
            const prevData = state.selectedUser
            if (checked) {
                return { selectedUser: [...prevData, user] }
            } else {
                if (prevData.some((prevUser) => user.id === prevUser.id)) {
                    return {
                        selectedUser: prevData.filter(
                            (prevUser) => prevUser.id !== user.id,
                        ),
                    }
                }
                return { selectedUser: prevData }
            }
        }),
    setSelectAllUser: (payload) => set(() => ({ selectedUser: payload })),
    setUserDialog: (payload) => set(() => ({ userDialog: payload })),
    setUserList: (payload) => set(() => ({ userList: payload })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))