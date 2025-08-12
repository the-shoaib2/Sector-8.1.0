import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { createVerificationToken, sendVerificationEmail } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 400 })
    }

    // Create verification token
    const token = await createVerificationToken(user.email)

    // Send verification email
    await sendVerificationEmail(user.email, user.name, token)

    return NextResponse.json({
      message: "Verification email sent successfully",
    })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ message: "Failed to send verification email" }, { status: 500 })
  }
}
