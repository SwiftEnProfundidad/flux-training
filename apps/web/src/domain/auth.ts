import { type AuthSession, authSessionSchema } from "@flux/contracts";

export interface AuthGateway {
  signInWithApple(): Promise<AuthSession>;
  signInWithEmail(email: string, password: string): Promise<AuthSession>;
}

export class CreateAuthSessionUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async executeWithApple(): Promise<AuthSession> {
    const session = await this.authGateway.signInWithApple();
    return authSessionSchema.parse(session);
  }

  async executeWithEmail(email: string, password: string): Promise<AuthSession> {
    const session = await this.authGateway.signInWithEmail(email, password);
    return authSessionSchema.parse(session);
  }
}

