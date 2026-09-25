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
- **Line length** — split entities that have sequences of items, like objects, arrays, parameter lists, and chained
  calls, across multiple line, one item per line, but not id the whole line fits in ~60 chars. 
- **Formatting** — tabs for indentation, single quotes, semicolons.
- **Line spacing** — use 1 empty lines between fields, 2 between functions; and fields; 3 between classes or regions
- **IDE Regions** — use //#region RegionName ... //#endregion to organize long sections of code. Standard regions, in order:
  - Scenes: Configuration (static config fields) → Constructor →
    Events (lifecycle methods init/preload/create/update plus event
    and timer handlers) → Internals.
  - UI components: Configuration → Constructor → Public API →
    Internals → named feature regions (Icons, Focus, Typing...)
    when a subsystem grows big enough to deserve its own.
  - Helper methods belong in Internals unless a more specific named
    region fits better.
  Region headers are a banner ending at column 80 (76 chars + tab):
  `//#region Name` padded with `/` to 76 chars, then a line of 76 `/`,
  then a blank line before the content.