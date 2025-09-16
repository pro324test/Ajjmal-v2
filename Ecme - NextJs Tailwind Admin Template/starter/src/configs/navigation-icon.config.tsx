import {
    PiHouseLineDuotone,
    PiUsersDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    users: <PiUsersDuotone />,
}

export default navigationIcon
