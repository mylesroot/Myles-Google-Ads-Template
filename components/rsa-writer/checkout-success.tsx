"use client"

import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false
})

export function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  })

  useEffect(() => {
    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout")

    if (checkoutStatus === "success") {
      setShowConfetti(true)

      toast({
        title: "Payment Successful!",
        description: "Your account has been updated successfully.",
        variant: "default"
      })

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 9000)

      return () => clearTimeout(timer)
    } else if (checkoutStatus === "canceled") {
      toast({
        title: "Payment Canceled",
        description: "Your checkout session was canceled.",
        variant: "destructive"
      })
    }
  }, [searchParams, toast])

  // Get checkout status for alert
  const checkoutStatus = searchParams.get("checkout")

  if (!checkoutStatus) return null

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {checkoutStatus === "success" && (
        <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle2 className="size-5" />
          <AlertTitle>Payment Successful!</AlertTitle>
          <AlertDescription>
            Thank you for your purchase. Your account has been updated with your
            new plan or credits.
          </AlertDescription>
        </Alert>
      )}

      {checkoutStatus === "canceled" && (
        <Alert className="mb-6 bg-orange-50 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
          <XCircle className="size-5" />
          <AlertTitle>Payment Canceled</AlertTitle>
          <AlertDescription>
            Your checkout session was canceled. No charges were made.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
