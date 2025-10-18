import React from 'react'

function Footer() {
return (
    <div
        id="footer"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full text-center bg-transparent py-2 z-50"
    >
        <span className="text-gq-purple">Made with</span>
        <span className="text-jl-red">{' <3 '}</span>
        <span className="text-gq-purple"> by Jason </span>
    </div>
)
}

export default Footer