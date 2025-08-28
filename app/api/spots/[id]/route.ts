import { type NextRequest, NextResponse } from "next/server"
import { databricksService } from "@/lib/databricks"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = await databricksService.deleteSpot(id)

    if (success) {
      return NextResponse.json({ success: true, message: "Spot deleted successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to delete spot" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] API DELETE /spots error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete spot" }, { status: 500 })
  }
}
