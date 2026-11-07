import {z} from 'zod';
import {privacyVersion} from './privacy';
export const contactSchema=z.object({
 name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),
 message:z.string().trim().min(10).max(3000),locale:z.enum(['fr','en','ar']),
 consent:z.literal(true),privacyVersion:z.literal(privacyVersion),
 website:z.string().max(200).optional().default(''),
});
export const visitSchema=z.object({page:z.enum(['/','/demo']),source:z.enum(['direct','prospectus'])});
