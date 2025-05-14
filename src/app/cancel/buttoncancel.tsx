"use client"

import React from "react"

export default function buttoncancel() {
  return (
    <div>
       <button 
            onClick={() => window.history.back()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl"
          >
            Try Again
          </button>
    </div>
  )
}
