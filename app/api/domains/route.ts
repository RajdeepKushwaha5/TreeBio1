import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CustomDomainService } from "@/lib/custom-domain";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const domains = await CustomDomainService.getUserDomains(userId);

    return NextResponse.json({
      success: true,
      data: domains
    });

  } catch (error) {
    console.error('Custom domains API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Check if user can add more domains
    const canAdd = await CustomDomainService.canAddDomain(userId);
    if (!canAdd.canAdd) {
      return NextResponse.json(
        { error: `Domain limit reached. You can have maximum ${canAdd.limit} domains.` },
        { status: 400 }
      );
    }

    const newDomain = await CustomDomainService.addDomain(userId, domain);

    return NextResponse.json({
      success: true,
      data: newDomain,
      message: 'Domain added successfully. Please verify ownership.'
    });

  } catch (error) {
    console.error('Add domain error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add domain' },
      { status: 500 }
    );
  }
}
