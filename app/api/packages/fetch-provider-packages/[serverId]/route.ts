import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const {serverId} =  await params

    const server = await prisma.server.findUnique({
      where: { id: serverId },
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Fetch packages from cPanel API
    const cpanelUrl = `https://${server.hostName}:2087/json-api/listpkgs`

    const response = await fetch(cpanelUrl, {
      method: "GET",
      headers: {
        Authorization: `whm root:${server.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch packages from server")
    }

    const data = await response.json()

    // Transform the response to match our interface
    const packages = data.package
      ? data.package.map((pkg: any) => ({
          name: pkg.name,
          QUOTA: pkg.QUOTA,
          BWLIMIT: pkg.BWLIMIT,
          MAXSUB: pkg.MAXSUB,
          MAXPOP: pkg.MAXPOP,
          MAXSQL: pkg.MAXSQL,
          MAXADDON: pkg.MAXADDON,
          MAXPARK: pkg.MAXPARK,
        }))
      : []

    return NextResponse.json({
      success: true,
      packages,
    })
  } catch (error) {
    console.error("Error fetching server packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages from server" }, { status: 500 })
  }
}
