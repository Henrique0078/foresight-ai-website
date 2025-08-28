import { type NextRequest, NextResponse } from "next/server"
import { databricksService } from "@/lib/databricks"

export async function GET() {
  try {
    const spots = await databricksService.getAllSpots()
    return NextResponse.json({ success: true, data: spots })
  } catch (error) {
    console.error("[v0] API GET /spots error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch spots" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const spotData = await request.json()
    const success = await databricksService.insertSpot(spotData)

    if (success) {
      return NextResponse.json({ success: true, message: "Spot created successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to create spot" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] API POST /spots error:", error)
    return NextResponse.json({ success: false, error: "Failed to create spot" }, { status: 500 })
  }
}
