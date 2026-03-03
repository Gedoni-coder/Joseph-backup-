// src/emails/verificationEmail.ts

export const verificationEmailHtml = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
      
      <h2 style="color: #111827;">Welcome to XIKHub 🎉</h2>
      
      <p>
        This is the <strong>XIKHub</strong> team, and we've built a student marketplace
         <strong> for students, by students</strong>, starting at UNIZIK.
      </p>

      <p>
        Please verify your email address to fully join the community.
      </p>

      <a
        href="{{VERIFICATION_LINK}}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Verify Email
      </a>

      <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
        If you didn’t create this account, you can safely ignore this email.
      </p>

    </div>
  </body>
</html>
`;
export const subject = (username: string) => {
  return `Wagwan ${username}, please verify your email`;
};

export const emailBody = (verificationLink: string) => {
  return `
Welcome to XIKHub 🎉

We’re excited to have you.

XIKHub is a student-powered marketplace built for Africa — starting at UNIZIK.
By students. For students.

Please confirm your email address to activate your account and start using XIKHub:

${verificationLink}

This link will expire soon for security reasons.
If you didn’t sign up, you can safely ignore this email.
`;
};
