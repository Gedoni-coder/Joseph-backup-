// src/modules/authentication/passport.ts

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.ts";
import { generateToken } from "../utils/generateToken.ts";
import { sendEmail } from "./nodemailer.ts";
import {
  googleWelcomeEmailHtml,
  googleWelcomeSubject,
  googleWelcomeText,
} from "../emails/googleWelcomeEmail.ts";
import { config } from "dotenv";
config();
const frontendUrl = process.env.FRONTEND_URL || "placeholder";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3001/api/v1/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { google_id: profile.id },
        });

        if (!user) {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            throw new Error("No email found in Google profile");
          }
          user = await prisma.user.create({
            data: {
              email: email!,
              name: profile.displayName,
              google_id: profile.id,
            },
          });
          //TODO: fix with actual frontendurl
          const html = googleWelcomeEmailHtml.replace(
            "{{DASHBOARD_LINK}}",
            `${frontendUrl}/dashboard`
          );

          await sendEmail({
            to: user.email,
            subject: googleWelcomeSubject(user.name),
            text: googleWelcomeText(),
            html: html,
          });
        }

        const token = generateToken(user.id, false);

        return done(null, { user, token });
      } catch (error) {
        done(error);
      }
    }
  )
);
