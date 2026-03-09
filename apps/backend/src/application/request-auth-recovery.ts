import {
  authRecoveryRequestSchema,
  authRecoveryResultSchema,
  type AuthRecoveryRequest,
  type AuthRecoveryResult
} from "@flux/contracts";

export class RequestAuthRecoveryUseCase {
  constructor(private readonly now: () => string = () => new Date().toISOString()) {}

  async execute(input: AuthRecoveryRequest): Promise<AuthRecoveryResult> {
    const payload = authRecoveryRequestSchema.parse(input);

    if (payload.channel === "email" && payload.identifier.includes("@") === false) {
      throw new Error("invalid_recovery_identifier");
    }

    const requestedAt = this.now();
    const ticketId = `rec-${payload.channel}-${requestedAt}`;

    const status =
      payload.channel === "email" ? "recovery_sent_email" : "recovery_sent_sms";

    return authRecoveryResultSchema.parse({
      channel: payload.channel,
      identifier: payload.identifier,
      status,
      ticketId,
      requestedAt
    });
  }
}
