# SKILLS.md — Claude Skills Guide

This file documents the Claude skills available to Daniyal/Affan and when Claude should use them across agency projects.

Claude should use the best-fit skill only when it clearly improves the task. Do not invoke many skills at once. Do not use a skill just because it exists.

## Core Rule

Pick skills by task.

- For existing UI improvement: use `redesign-skill` or `soft-skill`.
- For UI/accessibility review: use `web-design-guidelines`.
- For planning: use `superpowers:writing-plans`.
- For big complete code/document generation: use `output-skill`.
- For brand/identity work: use `brandkit`.
- For image-generation tasks: use image skills only when image backend is available.

Skills should never override project security rules in `SECURITY.md`.

## Design — Build / Apply Taste

Use these when creating or styling UI.

### soft-skill

High-end agency look: exact fonts, spacing, shadows, card structure, animation, and avoidance of cheap AI defaults.

Best for:
- making a page feel expensive
- premium UI polish
- layout/spacing improvements
- general visual refinement

### taste-skill

Anti-slop frontend for landing pages, portfolios, redesigns, and design-system-aware UI work.

Best for:
- landing pages
- redesigns
- portfolio-style pages
- improving generic AI-looking layouts

Note:
`taste-skill` installs under the name `design-taste-frontend` (v2, experimental). `taste-skill-v1` (`design-taste-frontend-v1`) is the legacy v1 — use only for exact backward compatibility.

Source: https://github.com/leonxlnx/taste-skill — a bundle of 13 design/taste skills (taste-skill, taste-skill-v1, soft-skill, redesign-skill, minimalist-skill, brutalist-skill, stitch-skill, gpt-tasteskill, brandkit, output-skill, image-to-code-skill, imagegen-frontend-web, imagegen-frontend-mobile). Verified 2026-07-08: all 13 already installed in `~/.claude/skills/` (global, all projects) and byte-identical to this repo — no reinstall needed.

### gpt-tasteskill

UX/UI + advanced GSAP motion skill.

Best for:
- marketing pages
- AIDA landing page structure
- editorial typography
- bento grids
- ScrollTrigger motion
- pinning/scrubbing effects

Use only when motion-heavy marketing work is requested.

### emil-design-eng

Emil Kowalski-style UI polish and animation philosophy.

Best for:
- easing decisions
- micro-interactions
- component craft
- premium animation decisions

### minimalist-skill

Clean editorial, warm monochrome, flat bento, muted pastels, no gradients/heavy shadows.

Best for:
- clean luxury/editorial sites
- calm modern designs
- minimal product pages

### brutalist-skill

Raw Swiss-print + military-terminal aesthetic.

Best for:
- data-heavy editorial pages
- declassified blueprint style
- rigid grids
- extreme type contrast

Use only when this aesthetic is explicitly desired.

### redesign-skill

Upgrade an existing site/app to feel premium while preserving functionality.

Best for:
- improving existing UI
- fixing generic AI-looking pages
- marketplace UI polish
- responsive spacing issues
- preserving existing logic while improving visuals

For Malir Cantt Bazaar, this is the default UI improvement skill.

### stitch-skill

Generates an agent-friendly `DESIGN.md` with typography, color, layout, and motion standards for Google Stitch.

Best for:
- preparing a design system file
- creating design instructions for future agents

## Review / Audit Skills

Use these when checking existing UI or motion quality.

### web-design-guidelines

Audits UI code against Vercel Web Interface Guidelines, accessibility, UX, and best practices.

Best for:
- “review my UI”
- “check accessibility”
- “audit this page”
- finding usability issues

Argument hint:
Use with a file path or pattern when available.

### review-animations

Strict animation/motion code review against Emil’s craft bar.

Important:
This is user-invoked only. Do not invoke automatically if skill metadata disables model invocation.

Best for:
- reviewing motion quality
- checking if animations feel premium
- validating easing/timing/micro-interactions

## Image Generation Skills

These need the Higgsfield MCP/image backend. They produce images, not code.

### imagegen-frontend-web

Creates premium website design references.

Best for:
- one horizontal image per website section
- visual references for web pages
- pre-build design exploration

### imagegen-frontend-mobile

Creates app-native mobile screen concepts inside phone mockups.

Best for:
- mobile app concepts
- mobile UI direction
- phone screen references

### image-to-code-skill

Generates design image(s), analyzes them, then builds the site to match.

Best for:
- image-first web design workflow
- matching a generated visual direction in code

### brandkit

Creates brand guideline boards, logo systems, identity decks, and premium mockups.

Best for:
- agency identity
- client brand identity
- logo systems
- brand guideline decks
- case study visuals

## Planning Skills

Superpowers plugin skills are process skills. Use for thinking and execution structure.

### superpowers:brainstorming

Turns an idea into a design/spec before building.

Best for:
- early-stage product ideas
- unclear feature direction
- client strategy sessions
- agency service ideas

### superpowers:writing-plans

Creates detailed task-by-task implementation plans.

Best for:
- complex feature planning
- security audits
- multi-step implementation
- breaking large tasks into safe phases

### superpowers:subagent-driven-development

Use when a complex plan benefits from subagent-style task execution.

Best for:
- larger multi-file implementation tasks
- parallelizable work
- structured development

### superpowers:executing-plans

Use when executing an already-written plan.

Best for:
- turning a detailed plan into implementation
- following a verified checklist

## Utility Skills

### extract-design-system

Reverse-engineers a public site's design tokens into starter files.

Important:
This runs `npx extract-design-system <url>` and downloads Chromium. It executes third-party code.

Rule:
Ask the user for confirmation before using.

Best for:
- extracting design tokens from a public site
- analyzing a design system
- creating starter theme files

### output-skill

Anti-truncation skill for complete, unabridged code output.

Best for:
- large complete files
- exhaustive generated docs
- long implementation output
- avoiding placeholders like “rest of code unchanged”

Rules:
- Do not use it for small edits.
- Use it when complete output matters.

## Project Fit — Malir Cantt Bazaar

Malir Cantt Bazaar is a premium dark-green, mobile-first local marketplace.

For this project:
- UI improvement: default to `redesign-skill`.
- Premium polish: use `soft-skill`.
- UI/accessibility audit: use `web-design-guidelines`.
- Motion polish: use `emil-design-eng`.
- Motion review: use `review-animations` only when user-invoked.
- Brand/case-study visuals: use `brandkit`.
- Large planning tasks: use `superpowers:writing-plans`.

Respect the existing design system.

Do not:
- redesign the whole site unless asked
- break live beta flows
- weaken backend security
- remove listing limits
- expose business verification documents
- merge automatically

## Security Skills

### vibesec-skill

Secure-coding guide for web applications. Use when writing or touching any web app code (frontend or backend), or when a scan/audit of existing code for common vulnerabilities is requested. Bug-hunter mindset: defense in depth, fail closed, least privilege.

Source: https://github.com/BehiSecc/VibeSec-Skill

### owasp-security

OWASP Top 10:2025, ASVS 5.0, LLM Top 10 (2025), and Agentic AI security (2026) reference. Use when reviewing code for security vulnerabilities, implementing auth/authorization, handling user input, or discussing web app security in depth (audits, security-focused code review). Ships reference files (`languages.md` for 20+ language-specific quirks, `owasp-report.md` for full standards deep-dive) loaded on demand — cheaper to reach for than re-deriving OWASP guidance from memory.

Source: https://github.com/agamm/claude-code-owasp

Installed 2026-07-04 from the `awesome-claude-skills` curated list (https://github.com/BehiSecc/awesome-claude-skills), per Daniyal's request. Both installed to `~/.claude/skills/` (global, all projects). `webapp-testing` (Playwright test toolkit) was also on the shortlist but was already available via the `example-skills` plugin — not reinstalled.

## Skills Not Fully Cataloged Yet

This catalog is based on Daniyal’s saved skills list.

The environment may also include additional skills such as:
- impeccable
- design-motion-principles
- humanizer
- ui-ux-pro-max
- claude-mem plugin skills
- vercel plugin skills
- caveman plugin skills
- other newly installed skills

When new skills are confirmed, update this file.

Until then:
- prefer the known skills above
- do not invent skill behavior
- do not invoke unknown skills without understanding their purpose

## Required Reporting After Skill Use

Whenever Claude uses a skill, report:

- skill used
- why it was used
- files changed
- tests/checks run
- risks or follow-up tasks

## Security Override

`SECURITY.md` overrides this file.

A skill must never:
- expose secrets
- rewrite whole files without approval
- touch production data without approval
- weaken auth/security
- auto-merge PRs
- remove existing working features
