import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";
import { RESEND_API_KEY } from "astro:env/server";
import { validateTurnstile, getClientIp } from "../utils/turnstileServer";

const resend = new Resend(RESEND_API_KEY);

/**
 * Validates turnstile token and throws appropriate error if validation fails
 * @param turnstileToken - The turnstile verification token
 * @param clientIp - The client's IP address
 */
async function validateTurnstileToken(
  turnstileToken: string,
  clientIp: string,
): Promise<void> {
  const validation = await validateTurnstile(turnstileToken, clientIp);

  if (!validation.success) {
    const errorCodes = validation["error-codes"] || ["verification-failed"];
    throw new ActionError({
      code: "BAD_REQUEST",
      message: `Verification failed: ${errorCodes.join(", ")}`,
    });
  }
}

/**
 * Server actions for handling form submissions and API requests
 */
export const server = {
  /**
   * Handles newsletter subscription with turnstile verification
   * Validates the email address, verifies turnstile token, and adds contact to Resend audience
   *
   * @param input - Form data containing email and turnstile token
   * @param context - Astro action context containing request information
   * @returns Promise resolving to success status and contact data
   * @throws ActionError for validation failures or subscription errors
   */
  subscribeToNewsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Please enter a valid email address"),
      "cf-turnstile-response": z
        .string()
        .min(1, "Please complete the verification"),
    }),

    handler: async (
      { email, "cf-turnstile-response": turnstileToken },
      context,
    ) => {
      const clientIp = getClientIp(context.request);
      await validateTurnstileToken(turnstileToken, clientIp);

      try {
        const { data, error } = await resend.contacts.create({
          email: email,
          unsubscribed: false,
          audienceId: "bb1e534e-a43e-4b67-9b8a-44b8fe607fce",
        });

        if (error) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        return { success: true, data };
      } catch (err) {
        if (err instanceof ActionError) throw err;

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send. Try again later.",
        });
      }
    },
  }),
};
