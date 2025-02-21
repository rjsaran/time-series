import { createHash } from 'crypto';
import moment from 'moment';

export class Utils {
  static createSha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  static parseAmount(amount: string | number): number | null {
    if (!amount) return null;

    const numericAmount = parseFloat(String(amount).replace(/[$,]/g, ''));

    return numericAmount > 0 ? numericAmount : null;
  }

  // Convert different date formats to standard YYYY-MM-DD
  static standardizeDate(date: string): string | null {
    const formattedDate = moment(date);

    return formattedDate.isValid() ? formattedDate.format() : null;
  }
}
