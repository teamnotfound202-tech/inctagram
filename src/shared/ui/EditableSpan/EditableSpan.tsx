import {type ChangeEvent, useState} from "react"

type Props = {
    value: string
    onChange: (title: string) => void
    disabled?: boolean
    spanClassName?: string
    inputClassName?: string
}

export const EditableSpan = ({value, onChange, disabled, spanClassName, inputClassName}: Props) => {
    const [title, setTitle] = useState(value)
    const [isEditMode, setIsEditMode] = useState(false)

    const turnOnEditMode = () => {
        if (!disabled) {
            setIsEditMode(true)
        }
    }

    const turnOffEditMode = () => {
        setIsEditMode(false)
        if (value !==title.trim()) {    //не выполнеять onChange, если текст в span не изменился
            onChange(title)
        }
    }

    const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.trim()) {
            setTitle(event.currentTarget.value)
        }
    }

    return (
        <>
            {isEditMode ? (
                <input
                    value={title}
                    onChange={changeTitle}
                    onBlur={turnOffEditMode}
                    autoFocus
                    disabled={disabled}
                    className={inputClassName}
                />
            ) : (
                <span onDoubleClick={turnOnEditMode} className={spanClassName}>{value}</span>
            )}
        </>
    )
}
