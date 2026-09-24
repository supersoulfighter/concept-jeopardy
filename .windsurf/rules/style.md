---
trigger: always_on
description: 
globs: 
---

# Code Style

## Context

- Teaching project for a high school game-dev class — students may have
  little or no coding experience. Optimize for readability over cleverness.
- Must stay portable to Phaser's Desktop web-only app, which runs all JS
  files in one shared global scope.

## Rules

- **No imports or modules** — every file is a script-tag global (required
  for Phaser Desktop portability).
- **Comments** — err toward extra comments, but keep them short. Explain
  steps and Phaser API calls a beginner wouldn't know.
- **Short functions** — prefer many small functions over long ones.
- **Simple syntax** — use terse/advanced syntax sparingly; clear beats
  clever for this audience.
- **K&R braces** — opening brace on the same line as the statement.
- **Line length** — split objects, arrays, parameter lists, and chained
  calls across multiple lines unless the whole line fits in ~60 chars.
- **Formatting** — tabs for indentation, single quotes, semicolons.
- **Line spacing** — use 1 empty lines between fields, 2 between functions; and fields; 3 between classes or major sections
- **Regions** — use IDE regions to organize long sections of code.