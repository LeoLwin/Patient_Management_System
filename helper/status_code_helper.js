exports.OK = function (data, message) {
  this.code = "200";
  this.status = "OK";
  this.message = message ? message : "No Error";
  if (data) {
    this.data = data;
  }
};

exports.SEE_OTHER = function (url, message) {
  this.code = "303";
  this.status = "SEE_OTHER";
  this.message = message ? message : "Please follow the URL provided";
  if (url) {
    this.url = url;
  }
};

exports.REDIRECT = function (url, message) {
  this.code = "303";
  this.status = "SEE_OTHER";
  this.message = message ? message : "Please follow the URL provided";
  if (url) {
    this.url = url;
  }
};

exports.INVALID_ARGUMENT = function (message) {
  this.code = "400";
  this.status = "INVALID_ARGUMENT";
  this.message = message ? message : "Client specified an invalid argument";
};

exports.UNAUTHENTICATED = function (message) {
  this.code = "401";
  this.status = "UNAUTHENTICATED";
  this.message = message ? message : "Request is not authenticated";
};

exports.PERMISSION_DENIED = function (message) {
  this.code = "403";
  this.status = "PERMISSION_DENIED";
  this.message = message ? message : "Permission denied";
};

exports.NOT_FOUND = function (message) {
  this.code = "404";
  this.status = "NOT_FOUND";
  this.message = message ? message : "A specified resource is not found";
};

exports.ALREADY_EXISTS = function (message) {
  this.code = "409";
  this.status = "ALREADY_EXISTS";
  this.message = message ? message : "Resource already exists";
};

exports.RESOURCE_EXHAUSTED = function (message) {
  this.code = "429";
  this.status = "RESOURCE_EXHAUSTED";
  this.message = message ? message : "Out of resource";
};

exports.CANCELLED = function (message) {
  this.code = "499";
  this.status = "CANCELLED";
  this.message = message ? message : "Request cancelled by the client";
};

exports.UNKNOWN = function (message) {
  this.code = "500";
  this.status = "UNKNOWN";
  this.message = message ? message : "Unknown Server Error";
};

exports.NOT_IMPLEMENTED = function (message) {
  this.code = "501";
  this.status = "NOT_IMPLEMENTED";
  this.message = message
    ? message
    : "API method is not implemented by the server";
};

exports.UNAVAILABLE = function (message) {
  this.code = "503";
  this.status = "UNAVAILABLE";
  this.message = message ? message : "Service unavailable";
};

exports.DEADLINE_EXCEEDED = function (message) {
  this.code = "504";
  this.status = "DEADLINE_EXCEEDED";
  this.message = message ? message : "Request deadline exceeded";
};
