// src/emails/oauthDeleteEmail.ts

export const oauthDeleteEmailHtml = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
      
      <h2 style="color: #111827;">Confirm Account Deletion ⚠️</h2>
      
      <p>
        This is the <strong>XIKHub</strong> team.
      </p>

      <p>
        You recently requested to <strong>delete your XIKHub account</strong>.
        Since your account was created using Google sign-in, we need you to confirm
        this action via email.
      </p>

      <p>
        If you proceed, <strong>your account and all associated data will be permanently removed</strong>.
        This action cannot be undone.
      </p>

      <a
        href="{{DELETE_LINK}}"
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
        Confirm Account Deletion
      </a>

      <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
        If you did not request this, you can safely ignore this email.
        Your account will remain unchanged.
      </p>

    </div>
  </body>
</html>
`;

export const oauthDeleteSubject = (username: string) => {
  return `⚠️ ${username}, confirm your XIKHub account deletion`;
};

export const oauthDeleteEmailBody = (deleteLink: string) => {
  return `
XIKHub Account Deletion Confirmation ⚠️

You recently requested to delete your XIKHub account.

Because your account was created using Google sign-in, we need you to confirm
this action via email.

Once confirmed:
- Your account will be permanently deleted
- All associated data will be removed
- This action cannot be undone

Confirm account deletion using the link below:

${deleteLink}

If you did not request this, you can safely ignore this email.
Your account will remain active.
`;
};
