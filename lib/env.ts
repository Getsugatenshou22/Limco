const requiredInProduction = [
  "DATABASE_URL",
  "JWT_SECRET",
] as const;

export type AppEnv = {
  nodeEnv: string;
  appUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  uploadRoot: string;
  paymentProofDir: string;
  certificateDir: string;
  courseAssetDir: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
};

function readOptionalInt(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getAppEnv(): AppEnv {
  const nodeEnv = process.env.NODE_ENV ?? "development";

  if (nodeEnv === "production") {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  }

  const uploadRoot = process.env.UPLOAD_DIR ?? "uploads";

  return {
    nodeEnv,
    appUrl: process.env.APP_URL ?? "http://localhost:3000",
    databaseUrl: process.env.DATABASE_URL ?? "mysql://USER:PASSWORD@HOST:PORT/DATABASE",
    jwtSecret: process.env.JWT_SECRET ?? "limco-development-secret-change-me",
    uploadRoot,
    paymentProofDir: `${uploadRoot}/payment-proofs`,
    certificateDir: `${uploadRoot}/certificates`,
    courseAssetDir: `${uploadRoot}/course-assets`,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: readOptionalInt(process.env.SMTP_PORT, 587),
    smtpSecure: process.env.SMTP_SECURE === "true",
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
  };
}
