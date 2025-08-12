import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const checkExistsSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = checkExistsSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Invalid input", details: validated.error.format() }, { status: 400 })
    }
    const { email, phone } = validated.data
    let exists = false
    let field = null
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        exists = true
        field = "email"
      }
    }

    return NextResponse.json({ exists, field })
  } catch (error) {
    console.error("Error checking existence:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}