class DataNotExistError extends Error {
    constructor(message) {
      super(message); 
      this.name = "DataNotExistError"; 
    }
  }
  class UserNotSameError extends Error {
    constructor(message) {
      super(message); 
      this.name = "UserNotSameError"; 
    }
  }

  class ServerError extends Error {
    constructor(message) {
      super(message); 
      this.name = "ServerError"; 
    }
  }

  class DoNotHaveAccessError extends Error {
    constructor(message) {
      super(message); 
      this.name = "DoNotHaveAccessError"; 
    }
  }

  class PasswordNotSameError extends Error {
    constructor(message) {
      super(message); 
      this.name = "PasswordNotSameError"; 
    }
  }

  class UnauthorizedAccessError extends Error {
    constructor(message) {
      super(message); 
      this.name = "UnauthorizedAccessError"; 
    }
  }

module.exports = {
    DataNotExistError,
    UserNotSameError,
    DoNotHaveAccessError,
    PasswordNotSameError,
    UnauthorizedAccessError
};
