import React, {useEffect, useRef, useState} from 'react';
import s from './CustomSelect.module.scss';
import {ArrowIcon} from "@/shared/ui/Pagination/CustomSelect/icons/ArrowIcon";

type Option = {
    value: string | number;
    label: string;
};

type CustomSelectProps = {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`${s.container} ${isOpen ? s.open : ''}`} ref={selectRef}>
            <div
                className={s.header}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={s.selectedValue}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={s.arrow}><ArrowIcon/></span>
            </div>

            {isOpen && (
                <div className={s.dropdown}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`${s.option} ${value === option.value ? s.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;

