{
  module: {
    // Disable handling of unknown requires
    // unknownContextRegExp: /$^/,
    // unknownContextCritical: false,

    // Disable handling of requires with a single expression
    // exprContextRegExp: /$^/,
    exprContextRequest: '.',
    exprContextCritical: false,

    // Warn for every expression in require
    // wrappedContextCritical: true
  }
}
