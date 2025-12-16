// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET - List all clients
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const industry = searchParams.get('industry')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) {
      where.status = { equals: status }
    }

    if (industry) {
      where.industry = { equals: industry }
    }

    if (search) {
      where.or = [
        { companyName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const result = await payload.find({
      collection: 'clients',
      where: Object.keys(where).length > 0 ? where : undefined,
      page,
      limit,
      sort: 'companyName',
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      data: result.docs,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch clients',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const client = await payload.create({
      collection: 'clients',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Client created successfully',
    })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create client',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
