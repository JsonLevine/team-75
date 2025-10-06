import React from 'react'

function Debug() {
return (
    <div className="min-h-screen flex items-start justify-center">
        <div className="container w-full flex flex-col mt-4 space-y-4">
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 bg-gq_violet hover:cursor-pointer hover:bg-gq_violet_hover mr-2 text-white text-2xl py-6 px-8 rounded-lg shadow-lg">Violet</button>
                <button className="w-1/2 bg-gq_violet_hover ml-2 text-white text-2xl py-6 px-8 rounded-lg shadow-lg">Violet_hover</button>
            </div>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 bg-gq_purple hover:cursor-pointer hover:bg-gq_purple_hover hover:text-black mr-2 text-white text-2xl py-6 px-8 rounded-lg shadow-lg">Purple</button>
                <button className="w-1/2 bg-gq_purple_hover ml-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Purple_hover</button>
            </div>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 bg-gq_blue hover:cursor-pointer hover:bg-gq_blue_hover mr-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Blue</button>
                <button className="w-1/2 bg-gq_blue_hover ml-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Blue_hover</button>
            </div>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 bg-gq_yellow hover:cursor-pointer hover:bg-gq_yellow_hover mr-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Yellow</button>
                <button className="w-1/2 bg-gq_yellow_hover ml-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Yellow_hover</button>
            </div>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 bg-gq_orange hover:cursor-pointer hover:bg-gq_orange_hover mr-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Orange</button>
                <button className="w-1/2 bg-gq_orange_hover ml-2 text-black text-2xl py-6 px-8 rounded-lg shadow-lg">Orange_hover</button>
            </div>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 bg-gq_red hover:cursor-pointer hover:bg-gq_red_hover mr-2 text-white text-2xl py-6 px-8 rounded-lg shadow-lg">Red</button>
                <button className="w-1/2 bg-gq_red_hover ml-2 text-white text-2xl py-6 px-8 rounded-lg shadow-lg">Red_hover</button>
            </div>
       </div>
    </div>
)
}

export default Debug