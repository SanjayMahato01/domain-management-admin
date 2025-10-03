import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET all packages
export async function GET(request: NextRequest) {
  try {
    const packages = await prisma.packages.findMany({
      include: {
        server: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const serializedPackages = packages.map((pkg) => ({
      ...pkg,
      bandwidth: pkg.bandwidth.toString(),
      price: pkg.price.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: serializedPackages,
    })
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

// POST create new package (creates 3 entries - one for each billing cycle)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      providerPackageName,
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

    if (!name || !serverId) {
      return NextResponse.json({ error: "Package name and server are required" }, { status: 400 })
    }

    const parsedBandwidth =
      bandwidth === "unlimited" || bandwidth === "Unlimited" || Number.parseInt(bandwidth) > 999999999
        ? BigInt(-1)
        : BigInt(Number.parseInt(bandwidth) || 0)

    const packageData = {
      name,
      providerPackageName: providerPackageName || null,
      description: description || "",
      diskSpace: Number.parseInt(diskSpace) || 0,
      bandwidth: parsedBandwidth,
      domains: Number.parseInt(domains) || 0,
      emailAccounts: Number.parseInt(emailAccounts) || 0,
      databases: Number.parseInt(databases) || 0,
      features: features || "",
      serverId,
      status: status === "active" ? "ACTIVE" : "INACTIVE",
    }

    const createdPackages = []

    if (monthlyPrice && Number.parseFloat(monthlyPrice) > 0) {
      const monthlyPackage = await prisma.packages.create({
        data: {
          ...packageData,
          billingCycle: "MONTHLY",
          price: Number.parseFloat(monthlyPrice),
        },
        include: { server: true },
      })
      createdPackages.push(monthlyPackage)
    }

    if (quarterlyPrice && Number.parseFloat(quarterlyPrice) > 0) {
      const quarterlyPackage = await prisma.packages.create({
        data: {
          ...packageData,
          billingCycle: "QUARTERLY",
          price: Number.parseFloat(quarterlyPrice),
        },
        include: { server: true },
      })
      createdPackages.push(quarterlyPackage)
    }

    if (yearlyPrice && Number.parseFloat(yearlyPrice) > 0) {
      const yearlyPackage = await prisma.packages.create({
        data: {
          ...packageData,
          billingCycle: "YEARLY",
          price: Number.parseFloat(yearlyPrice),
        },
        include: { server: true },
      })
      createdPackages.push(yearlyPackage)
    }

    if (createdPackages.length === 0) {
      return NextResponse.json({ error: "At least one price must be provided" }, { status: 400 })
    }

    const serializedPackages = createdPackages.map((pkg) => ({
      ...pkg,
      bandwidth: pkg.bandwidth.toString(),
      price: pkg.price.toString(),
    }))

    return NextResponse.json(
      {
        success: true,
        data: serializedPackages,
        message: `Created ${createdPackages.length} package(s)`,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}
