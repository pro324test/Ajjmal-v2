'use client'

import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { deleteUser } from '@/server/actions/users'
import type { User } from '../types'

type DeleteConfirmDialogProps = {
    isOpen: boolean
    onClose: () => void
    user: User | null
    onDeleted: () => void
}

const DeleteConfirmDialog = ({ isOpen, onClose, user, onDeleted }: DeleteConfirmDialogProps) => {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!user) return

        setLoading(true)
        try {
            await deleteUser(user.id)
            
            toast.push(
                <Notification type="success" title="Success">
                    User deleted successfully!
                </Notification>
            )
            
            onDeleted()
            onClose()
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    {error instanceof Error ? error.message : 'Failed to delete user'}
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h5 className="text-lg font-semibold text-red-600">
                    Delete User
                </h5>
            </div>
            
            <div className="p-6">
                <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete the user{' '}
                        <span className="font-semibold">{user?.fullName}</span>?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        This action will deactivate the user account. This action cannot be undone.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="plain"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleDelete}
                        loading={loading}
                    >
                        Delete User
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default DeleteConfirmDialog