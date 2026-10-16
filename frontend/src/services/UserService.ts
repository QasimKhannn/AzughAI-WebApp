// Minimal UserService without authentication
class UserService {
  static async login(email: string, password: string): Promise<void> {
    // No-op - authentication removed
    console.log('Login called (no-op):', email);
  }

  static async register(email: string, password: string): Promise<void> {
    // No-op - authentication removed
    console.log('Register called (no-op):', email);
  }

  static async logout(): Promise<void> {
    // No-op - authentication removed
    console.log('Logout called (no-op)');
  }

  static async checkEmail(email: string): Promise<boolean> {
    // Always return false - no existing users
    return false;
  }

  static getCurrentUser(): any {
    // Always return null - no current user
    return null;
  }
}

export default UserService;