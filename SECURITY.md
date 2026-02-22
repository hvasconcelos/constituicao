# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email the maintainer or open a private security advisory on GitHub

We will acknowledge your report within 48 hours and work on a fix as soon as possible.

## Scope

This project runs locally by default. The main security considerations are:

- **API keys**: Never commit `.env` files with real API keys
- **ChromaDB**: Runs locally without authentication by default
- **LLM responses**: The system prompt restricts responses to constitutional content only
