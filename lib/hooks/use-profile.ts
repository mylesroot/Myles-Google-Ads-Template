"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { SelectProfile } from "@/db/schema"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"

/**
 * Custom hook to fetch and access the current user's profile
 */
export function useProfile() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<SelectProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!isLoaded || !user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const result = await getProfileByUserIdAction(user.id)

        if (result.isSuccess) {
          setProfile(result.data)
          setError(null)
        } else {
          setError(result.message)
          setProfile(null)
        }
      } catch (err) {
        setError("Failed to fetch profile")
        setProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, isLoaded])

  return {
    profile,
    isLoading,
    error,
    refetch: async () => {
      if (user) {
        setIsLoading(true)
        const result = await getProfileByUserIdAction(user.id)
        if (result.isSuccess) {
          setProfile(result.data)
          setError(null)
        } else {
          setError(result.message)
        }
        setIsLoading(false)
      }
    }
  }
}
