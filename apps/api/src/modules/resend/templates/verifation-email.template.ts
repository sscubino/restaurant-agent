export const verificationEmailTemplate = (emailVerificationLink: string) => {
  return `
<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 500px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: auto;">
    <h2 style="color: #333;">Verify Your Account!</h2>
    <p style="color: #555;">Click the button below to verify your account and access ProjectRestaurant.</p>
    <a href="${emailVerificationLink}" 
    style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; 
      color: #fff; background-color: #ff6600; text-decoration: none; 
      border-radius: 5px; font-weight: bold; box-shadow: 0 3px 6px rgba(0,0,0,0.16);">
    Verify Account
    </a>
    <p style="font-size: 12px; color: #777;">If you did not request this verification, please ignore this message.</p>
  </div>
</div>
  `;
};
