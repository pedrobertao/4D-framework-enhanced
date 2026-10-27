# Supply chain check

Applies when the task adds, updates, or runs anything from outside the repo: packages (npm, pip, cargo, etc.), GitHub Actions, Docker base images, CDN scripts, install scripts (`curl … | sh`), MCP servers or plugins, and code snippets copied from the web.

Before adding or updating any of these, the brief requires:
- **Need:** first check whether the standard library or an existing dependency already covers it. Every new dependency adds risk.
- **It's the real thing:** the exact name matches the official project (check the registry page and the source repo). AI assistants sometimes suggest package names that don't exist, and attackers register those names ("slopsquatting"); others register near-miss names ("typosquatting").
- **Reputation:** an active, real source repository; a credible download count; no recent sudden change of owner or maintainer; no open security advisories.
- **Release age:** avoid versions published in the last few days (e.g. less than 7 days old) unless it's an urgent security fix. Most compromised releases are caught and pulled within that window.
- **Install-time code:** check for install or postinstall scripts and what they do. Prefer installing with scripts disabled when the tool allows it (e.g. `npm install --ignore-scripts`).
- **Pinning:** pin exact versions and commit the lockfile. Pin GitHub Actions to a full commit SHA, not a tag, and Docker images to a digest.
- **Least privilege:** give CI jobs, tokens, Actions, and MCP servers only the permissions they need.
- **Scan:** run the ecosystem's audit tool if available (`npm audit`, `pip-audit`, `cargo audit`, `osv-scanner`) and report the results.
- **License:** compatible with the project.

Claude must report what it checked for each third-party item and what it couldn't check. If something looks suspicious, stop and ask the user.
