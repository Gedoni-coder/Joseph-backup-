// src/emails/forgotPasswordEmail.ts

export const forgotPasswordEmailHtml = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">

      <h2 style="color: #111827;">Reset your password 🔐</h2>

      <p>
        We received a request to reset the password for your <strong>XIKHub</strong> account.
      </p>

      <p>
        Click the button below to create a new password. This link will expire shortly
        for security reasons.
      </p>

      <a
        href="{{RESET_LINK}}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #dc2626;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>

      <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
        If you didn’t request a password reset, you can safely ignore this email.
        Your password will remain unchanged.
      </p>

    </div>
  </body>
</html>
`;

export const forgotPasswordSubject = (username?: string) => {
  return username
    ? `Hey ${username}, reset your XIKHub password`
    : "Reset your XIKHub password";
};

export const forgotPasswordText = (resetLink: string) => `
Reset your XIKHub password 🔐

We received a request to reset the password for your XIKHub account.

Use the link below to set a new password. This link will expire shortly for security reasons:

${resetLink}

If you didn’t request this, you can safely ignore this email.
Your password will not be changed.
`;
