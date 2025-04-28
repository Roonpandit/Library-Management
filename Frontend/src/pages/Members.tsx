import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Members: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Library Members</h1>
      
      <div className="p-8 text-center">
        <p className="text-lg">This page is under construction.</p>
        <p className="mt-2 text-gray-600">Please check back later.</p>
      </div>
    </div>
  )
}

export default Members 