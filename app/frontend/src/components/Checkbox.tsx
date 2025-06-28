import React from 'react'

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {}

const Checkbox = ({ checked, onChange, ...props }: CheckboxProps) => {
    return (
        <>
            <input type="checkbox" checked={checked} onChange={onChange} {...props} />
            <style jsx>{`
                input[type='checkbox'] {
                    margin-right: 8px; /* Spacing between checkbox and label if any */
                    cursor: pointer;
                    width: 16px; /* Custom size */
                    height: 16px; /* Custom size */
                }
                /* Add more specific styling if needed, e.g., for custom checkbox appearance */
            `}</style>
        </>
    )
}

export default Checkbox
