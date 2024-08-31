import { ReactNode } from 'react'

type DataSwitch<T extends string> = {
    name: T,
    children: ReactNode
}

function SwitchLayout<T extends string>({ data, name }: { data: DataSwitch<T>[], name: T[] }): ReactNode | null {    
    return data.find(child => child.name === name[name.length - 1])?.children;
}

export default SwitchLayout
