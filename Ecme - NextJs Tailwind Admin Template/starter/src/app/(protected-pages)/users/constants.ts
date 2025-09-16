export const USER_ROLES = {
    SYSTEM_STAFF: 'SYSTEM_STAFF',
    CUSTOMER: 'CUSTOMER', 
    VENDOR: 'VENDOR',
    DELIVERY_PERSON: 'DELIVERY_PERSON',
} as const

export const USER_ROLE_LABELS = {
    [USER_ROLES.SYSTEM_STAFF]: 'System Staff',
    [USER_ROLES.CUSTOMER]: 'Customer',
    [USER_ROLES.VENDOR]: 'Vendor',
    [USER_ROLES.DELIVERY_PERSON]: 'Delivery Person',
} as const

export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const

export const USER_STATUS_LABELS = {
    [USER_STATUS.ACTIVE]: 'Active',
    [USER_STATUS.INACTIVE]: 'Inactive',
} as const