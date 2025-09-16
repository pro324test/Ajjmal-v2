'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import FormItem from '@/components/ui/Form/FormItem'
import FormContainer from '@/components/ui/Form/FormContainer'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useUsersStore } from '../_store/usersStore'
import { USER_ROLE_LABELS } from '../constants'
import { createUser, updateUser } from '@/server/actions/users'
import type { CreateUserData, UpdateUserData, User } from '../types'

// Form validation schema
const userSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    roles: z.array(z.string()).min(1, 'At least one role must be selected'),
    isActive: z.boolean()
})

type FormData = z.infer<typeof userSchema>

type RoleOption = {
    label: string
    value: string
}

const UserDialog = () => {
    const [loading, setLoading] = useState(false)
    const userDialog = useUsersStore((state) => state.userDialog)
    const setUserDialog = useUsersStore((state) => state.setUserDialog)
    
    const isEdit = userDialog.type === 'edit'
    const isOpen = userDialog.open

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            roles: [],
            isActive: true
        }
    })

    // Get the user to edit from the store (you'll need to add this to the store)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const roleOptions: RoleOption[] = Object.entries(USER_ROLE_LABELS).map(([value, label]) => ({
        label,
        value,
    }))

    useEffect(() => {
        if (isOpen && isEdit && editingUser) {
            // Populate form with existing user data
            const activeRoles = editingUser.roles
                .filter(role => role.isActive)
                .map(role => role.role)
            
            setValue('fullName', editingUser.fullName)
            setValue('email', editingUser.email || '')
            setValue('phoneNumber', editingUser.phoneNumber)
            setValue('roles', activeRoles)
            setValue('isActive', editingUser.isActive)
            // Don't set password for edit mode
        } else if (isOpen && !isEdit) {
            // Reset form for new user
            reset({
                fullName: '',
                email: '',
                phoneNumber: '',
                password: '',
                roles: [],
                isActive: true
            })
        }
    }, [isOpen, isEdit, editingUser, setValue, reset])

    const handleClose = () => {
        setUserDialog({ type: '', open: false })
        setEditingUser(null)
        reset()
    }

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        try {
            if (isEdit && editingUser) {
                // Update user
                const updateData: UpdateUserData = {
                    id: editingUser.id,
                    fullName: data.fullName,
                    email: data.email || undefined,
                    phoneNumber: data.phoneNumber,
                    isActive: data.isActive,
                    roles: data.roles.map(role => ({
                        role,
                        isActive: true,
                        isPrimary: false // You might want to add logic for primary role selection
                    }))
                }
                
                if (data.password) {
                    updateData.password = data.password
                }

                await updateUser(updateData)
                
                toast.push(
                    <Notification type="success" title="Success">
                        User updated successfully!
                    </Notification>
                )
            } else {
                // Create new user
                if (!data.password) {
                    throw new Error('Password is required for new users')
                }

                const createData: CreateUserData = {
                    fullName: data.fullName,
                    email: data.email || undefined,
                    phoneNumber: data.phoneNumber,
                    password: data.password,
                    isActive: data.isActive,
                    roles: data.roles.map((role, index) => ({
                        role,
                        isActive: true,
                        isPrimary: index === 0 // First role is primary
                    }))
                }

                await createUser(createData)
                
                toast.push(
                    <Notification type="success" title="Success">
                        User created successfully!
                    </Notification>
                )
            }

            handleClose()
            // Trigger refresh of user list
            window.location.reload() // Simple refresh for now
        } catch (error) {
            console.error('Error saving user:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    {error instanceof Error ? error.message : 'Failed to save user'}
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // Function to set the user to edit (will be called from UsersTable)
    const setUserToEdit = (user: User) => {
        setEditingUser(user)
    }

    // Export this function so it can be used by other components
    if (typeof window !== 'undefined') {
        (window as any).setUserToEdit = setUserToEdit
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h5 className="text-lg font-semibold">
                    {isEdit ? 'Edit User' : 'Add New User'}
                </h5>
            </div>
            
            <div className="p-6">
                <FormContainer>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormItem
                            label="Full Name"
                            invalid={!!errors.fullName}
                            errorMessage={errors.fullName?.message}
                        >
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter full name"
                                        invalid={!!errors.fullName}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Email"
                            invalid={!!errors.email}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Enter email address"
                                        invalid={!!errors.email}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Phone Number"
                            invalid={!!errors.phoneNumber}
                            errorMessage={errors.phoneNumber?.message}
                        >
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter phone number"
                                        invalid={!!errors.phoneNumber}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label={isEdit ? "New Password (leave empty to keep current)" : "Password"}
                            invalid={!!errors.password}
                            errorMessage={errors.password?.message}
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder={isEdit ? "Enter new password" : "Enter password"}
                                        invalid={!!errors.password}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Roles"
                            invalid={!!errors.roles}
                            errorMessage={errors.roles?.message}
                        >
                            <Controller
                                name="roles"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        placeholder="Select roles"
                                        options={roleOptions}
                                        value={roleOptions.filter(option => 
                                            field.value.includes(option.value)
                                        )}
                                        onChange={(selectedOptions) => {
                                            const values = selectedOptions 
                                                ? selectedOptions.map(option => option.value)
                                                : []
                                            field.onChange(values)
                                        }}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        onChange={(checked) => field.onChange(checked)}
                                    >
                                        Active User
                                    </Checkbox>
                                )}
                            />
                        </FormItem>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={loading}
                            >
                                {isEdit ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </FormContainer>
            </div>
        </Dialog>
    )
}

export default UserDialog