import React from 'react'

function CustomButton({ text, className, onClick }) {
    return (
        <button
            className={`${className} rounded-lg animate ease-linear hover:duration-150 hover:scale-110 hover:cursor-pointer`}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default CustomButton