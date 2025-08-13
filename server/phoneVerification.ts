import { logger } from "./logger";

interface VerificationCode {
  code: string;
  phone: string;
  orderId: string;
  expiresAt: Date;
  verified: boolean;
}

class PhoneVerificationService {
  private verificationCodes: Map<string, VerificationCode> = new Map();
  private readonly CODE_EXPIRY_MINUTES = 10;
  private readonly CODE_LENGTH = 6;

  // Generate a random verification code
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate verification code for cash-on-delivery orders
  async generateVerificationCode(phone: string, orderId: string): Promise<string> {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000);
    
    const verification: VerificationCode = {
      code,
      phone,
      orderId,
      expiresAt,
      verified: false
    };

    this.verificationCodes.set(phone, verification);
    
    logger.info('Verification code generated', { 
      phone: this.maskPhone(phone), 
      orderId,
      expiresAt: expiresAt.toISOString()
    });

    // In production, this would send SMS via Twilio/SMS service
    // For now, we'll log it for testing
    await this.sendSMS(phone, code, orderId);
    
    return code;
  }

  // Mock SMS sending (in production, integrate with Twilio or other SMS service)
  private async sendSMS(phone: string, code: string, orderId: string): Promise<void> {
    logger.info('SMS sent (mock)', {
      phone: this.maskPhone(phone),
      orderId,
      message: `Your MRIDULOTA order verification code is: ${code}. Valid for ${this.CODE_EXPIRY_MINUTES} minutes.`
    });

    // TODO: In production, implement actual SMS sending:
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    await client.messages.create({
      body: `Your MRIDULOTA order verification code is: ${code}. Valid for ${this.CODE_EXPIRY_MINUTES} minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */
  }

  // Verify the code provided by customer
  async verifyCode(phone: string, code: string, orderId: string): Promise<{ success: boolean; message: string }> {
    const verification = this.verificationCodes.get(phone);
    
    if (!verification) {
      logger.warn('Verification code not found', { phone: this.maskPhone(phone), orderId });
      return { success: false, message: 'Verification code not found or expired' };
    }

    if (verification.orderId !== orderId) {
      logger.warn('Order ID mismatch for verification', { 
        phone: this.maskPhone(phone), 
        providedOrderId: orderId,
        expectedOrderId: verification.orderId 
      });
      return { success: false, message: 'Invalid verification request' };
    }

    if (verification.expiresAt < new Date()) {
      logger.warn('Verification code expired', { phone: this.maskPhone(phone), orderId });
      this.verificationCodes.delete(phone);
      return { success: false, message: 'Verification code has expired' };
    }

    if (verification.code !== code) {
      logger.warn('Invalid verification code provided', { phone: this.maskPhone(phone), orderId });
      return { success: false, message: 'Invalid verification code' };
    }

    // Mark as verified
    verification.verified = true;
    this.verificationCodes.set(phone, verification);
    
    logger.info('Phone verification successful', { phone: this.maskPhone(phone), orderId });
    
    return { success: true, message: 'Phone verified successfully' };
  }

  // Check if a phone number is verified for a specific order
  isPhoneVerified(phone: string, orderId: string): boolean {
    const verification = this.verificationCodes.get(phone);
    return verification?.orderId === orderId && verification.verified && verification.expiresAt > new Date();
  }

  // Clean up expired verification codes
  cleanupExpiredCodes(): void {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [phone, verification] of this.verificationCodes.entries()) {
      if (verification.expiresAt < now) {
        this.verificationCodes.delete(phone);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.info('Cleaned up expired verification codes', { count: cleanedCount });
    }
  }

  // Resend verification code
  async resendVerificationCode(phone: string, orderId: string): Promise<{ success: boolean; message: string }> {
    const existing = this.verificationCodes.get(phone);
    
    if (existing && existing.orderId === orderId) {
      // Generate new code
      const newCode = await this.generateVerificationCode(phone, orderId);
      logger.info('Verification code resent', { phone: this.maskPhone(phone), orderId });
      return { success: true, message: 'Verification code resent successfully' };
    }
    
    return { success: false, message: 'Cannot resend verification code' };
  }

  // Utility function to mask phone number for logging
  private maskPhone(phone: string): string {
    if (phone.length <= 4) return '*'.repeat(phone.length);
    return phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2);
  }

  // Get verification status for admin
  getVerificationStatus(phone: string): { exists: boolean; verified: boolean; expiresAt?: Date } {
    const verification = this.verificationCodes.get(phone);
    return {
      exists: !!verification,
      verified: verification?.verified || false,
      expiresAt: verification?.expiresAt
    };
  }
}

export const phoneVerificationService = new PhoneVerificationService();

// Clean up expired codes every 5 minutes
setInterval(() => {
  phoneVerificationService.cleanupExpiredCodes();
}, 5 * 60 * 1000);