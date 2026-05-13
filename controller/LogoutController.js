class LogoutController {
  static async logout() {
    return {
      message: 'Logged out successfully'
    };
  }
}

module.exports = LogoutController;