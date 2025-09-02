import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DomainConfig {
  id: string;
  userId: string;
  domain: string;
  isActive: boolean;
  isVerified: boolean;
  verificationMethod: 'DNS' | 'FILE';
  verificationToken: string;
  dnsRecords?: DNSRecord[];
  sslCertificate?: SSLCertificate;
  createdAt: Date;
  updatedAt: Date;
}

export interface DNSRecord {
  type: 'CNAME' | 'A' | 'TXT';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface SSLCertificate {
  issuedAt: Date;
  expiresAt: Date;
  issuer: string;
  fingerprint: string;
}

export interface DomainVerificationResult {
  isVerified: boolean;
  method: 'DNS' | 'FILE';
  errors?: string[];
  records?: DNSRecord[];
}

export class CustomDomainService {
  /**
   * Add a custom domain for a user
   */
  static async addDomain(userId: string, domain: string): Promise<DomainConfig> {
    // Validate domain format
    if (!this.isValidDomain(domain)) {
      throw new Error('Invalid domain format');
    }

    // Check if domain already exists
    const existing = await prisma.customDomain.findFirst({
      where: { domain: domain.toLowerCase() }
    });

    if (existing) {
      throw new Error('Domain already registered');
    }

    // Generate verification token
    const verificationToken = this.generateVerificationToken();

    const customDomain = await prisma.customDomain.create({
      data: {
        userId,
        domain: domain.toLowerCase(),
        isActive: false,
        isVerified: false,
        verificationMethod: 'DNS',
        verificationToken,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return this.formatDomainConfig(customDomain);
  }

  /**
   * Get user's domains
   */
  static async getUserDomains(userId: string): Promise<DomainConfig[]> {
    const domains = await prisma.customDomain.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return domains.map(this.formatDomainConfig);
  }

  /**
   * Get domain by domain name
   */
  static async getDomainByName(domain: string): Promise<DomainConfig | null> {
    const customDomain = await prisma.customDomain.findFirst({
      where: { domain: domain.toLowerCase() }
    });

    return customDomain ? this.formatDomainConfig(customDomain) : null;
  }

  /**
   * Verify domain ownership
   */
  static async verifyDomain(domainId: string): Promise<DomainVerificationResult> {
    const domain = await prisma.customDomain.findUnique({
      where: { id: domainId }
    });

    if (!domain) {
      throw new Error('Domain not found');
    }

    let verificationResult: DomainVerificationResult;

    if (domain.verificationMethod === 'DNS') {
      verificationResult = await this.verifyDNSMethod(domain.domain, domain.verificationToken);
    } else {
      verificationResult = await this.verifyFileMethod(domain.domain, domain.verificationToken);
    }

    // Update verification status
    if (verificationResult.isVerified) {
      await prisma.customDomain.update({
        where: { id: domainId },
        data: {
          isVerified: true,
          isActive: true,
          updatedAt: new Date()
        }
      });
    }

    return verificationResult;
  }

  /**
   * Remove domain
   */
  static async removeDomain(userId: string, domainId: string): Promise<void> {
    await prisma.customDomain.delete({
      where: {
        id: domainId,
        userId // Ensure user owns the domain
      }
    });
  }

  /**
   * Toggle domain active status
   */
  static async toggleDomainStatus(userId: string, domainId: string): Promise<DomainConfig> {
    const domain = await prisma.customDomain.findFirst({
      where: { id: domainId, userId }
    });

    if (!domain) {
      throw new Error('Domain not found');
    }

    if (!domain.isVerified && !domain.isActive) {
      throw new Error('Domain must be verified before activating');
    }

    const updated = await prisma.customDomain.update({
      where: { id: domainId },
      data: {
        isActive: !domain.isActive,
        updatedAt: new Date()
      }
    });

    return this.formatDomainConfig(updated);
  }

  /**
   * Get required DNS records for domain verification
   */
  static getDNSRecords(domain: string, verificationToken: string): DNSRecord[] {
    return [
      {
        type: 'TXT',
        name: `_treebio-verification.${domain}`,
        value: verificationToken,
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: domain,
        value: 'treebio.app',
        ttl: 3600
      }
    ];
  }

  /**
   * Get domain statistics
   */
  static async getDomainStats(domainId: string): Promise<{
    totalVisits: number;
    uniqueVisitors: number;
    lastVisit: Date | null;
    topPages: Array<{ page: string; visits: number }>;
  }> {
    // Implementation would depend on analytics system
    // This is a placeholder for the analytics integration
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      lastVisit: null,
      topPages: []
    };
  }

  /**
   * Validate domain format
   */
  private static isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain) && domain.length <= 253;
  }

  /**
   * Generate verification token
   */
  private static generateVerificationToken(): string {
    return `treebio-verify-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
  }

  /**
   * Verify domain using DNS method
   */
  private static async verifyDNSMethod(domain: string, token: string): Promise<DomainVerificationResult> {
    try {
      // In a real implementation, you would use DNS lookup libraries
      // This is a simplified version for demonstration
      const dns = await import('dns').then(m => m.promises);
      
      try {
        const records = await dns.resolveTxt(`_treebio-verification.${domain}`);
        const isVerified = records.some(record => 
          record.some(txt => txt === token)
        );

        return {
          isVerified,
          method: 'DNS',
          records: this.getDNSRecords(domain, token)
        };
      } catch (error) {
        return {
          isVerified: false,
          method: 'DNS',
          errors: ['TXT record not found or incorrect'],
          records: this.getDNSRecords(domain, token)
        };
      }
    } catch (error) {
      return {
        isVerified: false,
        method: 'DNS',
        errors: ['DNS verification failed'],
        records: this.getDNSRecords(domain, token)
      };
    }
  }

  /**
   * Verify domain using file method
   */
  private static async verifyFileMethod(domain: string, token: string): Promise<DomainVerificationResult> {
    try {
      const verificationUrl = `https://${domain}/.well-known/treebio-verification.txt`;
      const response = await fetch(verificationUrl);
      const content = await response.text();
      
      const isVerified = content.trim() === token;
      
      return {
        isVerified,
        method: 'FILE',
        errors: isVerified ? undefined : ['Verification file not found or content incorrect']
      };
    } catch (error) {
      return {
        isVerified: false,
        method: 'FILE',
        errors: ['Could not access verification file']
      };
    }
  }

  /**
   * Format domain config from database record
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static formatDomainConfig(domain: any): DomainConfig {
    return {
      id: domain.id,
      userId: domain.userId,
      domain: domain.domain,
      isActive: domain.isActive,
      isVerified: domain.isVerified,
      verificationMethod: domain.verificationMethod,
      verificationToken: domain.verificationToken,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Check if user can add more domains
   */
  static async canAddDomain(userId: string): Promise<{ canAdd: boolean; current: number; limit: number }> {
    const current = await prisma.customDomain.count({
      where: { userId }
    });
    
    // Default limit is 3 domains per user (could be configurable based on plan)
    const limit = 3;
    
    return {
      canAdd: current < limit,
      current,
      limit
    };
  }

  /**
   * Get domain health status
   */
  static async getDomainHealth(domain: string): Promise<{
    isAccessible: boolean;
    sslValid: boolean;
    responseTime: number;
    lastChecked: Date;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        isAccessible: response.ok,
        sslValid: true, // Would need additional SSL checking
        responseTime,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        isAccessible: false,
        sslValid: false,
        responseTime: Date.now() - startTime,
        lastChecked: new Date()
      };
    }
  }
}
