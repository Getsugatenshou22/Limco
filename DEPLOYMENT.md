# Render LMS Deployment

## Server prerequisites

- Node.js 18+
- MySQL reachable through `DATABASE_URL`
- Writable upload path exposed through `UPLOAD_DIR`
- Optional SMTP credentials for EFT approval/rejection email notifications
- PM2 installed globally if you want process supervision

## First-time setup

1. Copy `.env.example` to `.env` and fill in the production values.
2. Set `UPLOAD_DIR` to a writable relative directory such as `uploads`.
3. Install dependencies with `npm install`.
4. Build the app with `npm run build`.
5. Start it with `npm start` or PM2.

## PM2

- Update `cwd` inside `ecosystem.config.js` to match the deployed app path.
- Start the service with `pm2 start ecosystem.config.js`.
- Persist PM2 on reboot with `pm2 save`.

## Notes

- The LMS auto-creates the MySQL schema and seeds the current course/user catalog on first boot.
- Seeded demo accounts use password `Pass@123` and should be changed before public rollout.
- Certificates and EFT proofs are stored on disk and served back through authenticated LMS file endpoints.
