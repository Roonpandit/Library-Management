"use client"

import { useState, useEffect, type FormEvent } from "react"
import { api } from "../../services/api"
import type { User } from "../../types"

const Profile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<User>("/auth/profile")
        setUser(data)
        setName(data.name)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to fetch profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setUpdateLoading(true)
      setUpdateError(null)
      setUpdateSuccess(false)

      // This is a mock update since the API doesn't have a profile update endpoint
      // In a real application, you would call the API to update the profile
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      if (user) {
        setUser({
          ...user,
          name,
        })
      }

      setUpdateSuccess(true)
    } catch (error) {
      console.error("Error updating profile:", error)
      setUpdateError("Failed to update profile. Please try again later.")
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (error || !user) {
    return <div className="p-4 text-red-700 bg-red-100 rounded-md">{error || "User not found"}</div>
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="p-6 bg-white rounded-[10px] shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>

        {updateSuccess && (
          <div className="p-4 mt-4 text-green-700 bg-green-100 rounded-md">Profile updated successfully!</div>
        )}

        {updateError && <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-md">{updateError}</div>}

        <form onSubmit={handleUpdateProfile} className="mt-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="block w-full mt-1 text-gray-500 bg-gray-100 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              id="role"
              value={user.role}
              disabled
              className="block w-full mt-1 text-gray-500 bg-gray-100 border-gray-300 rounded-[10px] shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={updateLoading} className="btn btn-primary">
              {updateLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
