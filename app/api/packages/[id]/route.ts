import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET single package
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageData = await prisma.packages.findUnique({
      where: { id: params.id },
      include: {
        server: true,
      },
    })

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: packageData,
    })
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}

// PUT update package
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const {
      name,
      description,
      diskSpace,
      bandwidth,
      domains,
      emailAccounts,
      databases,
      features,
      monthlyPrice,
      quarterlyPrice,
      yearlyPrice,
      serverId,
      status,
    } = body

    // First, get the existing package to find its name and server
    const existingPackage = await prisma.packages.findUnique({
      where: { id: params.id },
    })

    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Parse bandwidth - handle unlimited as -1
    const parsedBandwidth =
      bandwidth === "unlimited" || Number.parseInt(bandwidth) > 999999999 ? -1 : Number.parseInt(bandwidth) || 0

    const packageData = {
      name: name || existingPackage.name,
      description: description || "",
      diskSpace: Number.parseInt(diskSpace) || 0,
      bandwidth: parsedBandwidth,
      domains: Number.parseInt(domains) || 0,
      emailAccounts: Number.parseInt(emailAccounts) || 0,
      databases: Number.parseInt(databases) || 0,
      features: features || "",
      serverId: serverId || existingPackage.serverId,
      status: status === "active" ? "ACTIVE" : "INACTIVE",
    }

    // Find all packages with the same name and server
    const relatedPackages = await prisma.packages.findMany({
      where: {
        name: existingPackage.name,
        serverId: existingPackage.serverId,
      },
    })

    // Update all related packages with the new data
    const updatePromises = relatedPackages.map((pkg) => {
      let price = pkg.price

      // Update price based on billing cycle
      if (pkg.billingCycle === "MONTHLY" && monthlyPrice) {
        price = Number.parseFloat(monthlyPrice)
      } else if (pkg.billingCycle === "QUARTERLY" && quarterlyPrice) {
        price = Number.parseFloat(quarterlyPrice)
      } else if (pkg.billingCycle === "YEARLY" && yearlyPrice) {
        price = Number.parseFloat(yearlyPrice)
      }

      return prisma.packages.update({
        where: { id: pkg.id },
        data: {
          ...packageData,
          billingCycle: pkg.billingCycle,
          price,
        },
        include: {
          server: true,
        },
      })
    })

    const updatedPackages = await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      data: updatedPackages,
      message: `Updated ${updatedPackages.length} package(s)`,
    })
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}

// DELETE package
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First, get the package to find its name and server
    const packageToDelete = await prisma.packages.findUnique({
      where: { id: params.id },
    })

    if (!packageToDelete) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Delete all packages with the same name and server (all billing cycles)
    const deleteResult = await prisma.packages.deleteMany({
      where: {
        name: packageToDelete.name,
        serverId: packageToDelete.serverId,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.count} package(s)`,
    })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}
