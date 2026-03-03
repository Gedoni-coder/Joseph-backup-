// src/emails/googleWelcomeEmail.ts

export const googleWelcomeEmailHtml = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
      
      <h2 style="color: #111827;">Welcome to XIKHub 🎉</h2>

      <p>
        You’ve successfully joined <strong>XIKHub</strong> using your Google account.
      </p>

      <p>
        XIKHub is a student marketplace built <strong>for students, by students</strong>,
        starting at UNIZIK — and growing across Africa.
      </p>

      <p>
        Your email has already been verified by Google, so you’re good to go 🚀
      </p>

      <a
        href="{{DASHBOARD_LINK}}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #16a34a;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Go to Dashboard
      </a>

      <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
        If you didn’t create this account, please contact support immediately.
      </p>

    </div>
  </body>
</html>
`;

export const googleWelcomeSubject = (username: string) =>
  `Welcome to XIKHub, ${username} 🎉`;
    
export const googleWelcomeText = () => `
Welcome to XIKHub 🎉

You signed up using Google, and your email has already been verified.

XIKHub is a student-powered marketplace built for Africa — starting at UNIZIK.
By students. For students.

You can now start buying, selling, and connecting with other students.

See you inside 🚀
`;
