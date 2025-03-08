/*
<ai_context>
This file contains the GoogleAdsApiClient class, which is used to make requests to the Google Ads API.
</ai_context>
*/

import { clerkClient } from "@clerk/nextjs/server"

export class GoogleAdsApiClient {
  private baseUrl = "https://googleads.googleapis.com"
  private accessToken: string
  private loginCustomerId?: string

  constructor(accessToken: string, loginCustomerId?: string) {
    this.accessToken = accessToken
    this.loginCustomerId = loginCustomerId
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      ...(options.headers as Record<string, string>)
    }

    if (this.loginCustomerId) {
      headers["login-customer-id"] = this.loginCustomerId
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Ads API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Google Ads API error: ${errorText}`)
    }

    return response.json()
  }
}

export async function getGoogleAdsClient(
  userId: string,
  loginCustomerId?: string
) {
  try {
    const client = await clerkClient()

    const { data: tokens } = await client.users.getUserOauthAccessToken(
      userId,
      "google" as any
    )

    const accessToken = tokens[0]?.token

    if (!accessToken) {
      throw new Error("No Google access token found for user")
    }

    return new GoogleAdsApiClient(accessToken, loginCustomerId)
  } catch (error) {
    console.error("Error getting Google Ads client:", error)
    throw error
  }
}
