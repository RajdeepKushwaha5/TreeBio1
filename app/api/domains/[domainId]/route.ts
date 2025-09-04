import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CustomDomainService } from "@/lib/custom-domain";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { domainId } = await params;
    const verificationResult = await CustomDomainService.verifyDomain(domainId);

    return NextResponse.json({
      success: true,
      data: verificationResult,
      message: verificationResult.isVerified 
        ? 'Domain verified successfully!' 
        : 'Domain verification failed. Please check your DNS settings.'
    });

  } catch (error) {
    console.error('Domain verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify domain' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { domainId } = await params;
    const { action } = await request.json();

    if (action === 'toggle') {
      const updatedDomain = await CustomDomainService.toggleDomainStatus(userId, domainId);
      
      return NextResponse.json({
        success: true,
        data: updatedDomain,
        message: `Domain ${updatedDomain.isActive ? 'activated' : 'deactivated'} successfully`
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Domain update error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update domain' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { domainId } = await params;
    await CustomDomainService.removeDomain(userId, domainId);

    return NextResponse.json({
      success: true,
      message: 'Domain removed successfully'
    });

  } catch (error) {
    console.error('Domain deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to remove domain' },
      { status: 500 }
    );
  }
}
