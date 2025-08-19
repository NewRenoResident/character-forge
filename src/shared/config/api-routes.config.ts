export const ROUTES = {
  UPLOADS: (fileName: string) => process.env.API + fileName,
} as const;
