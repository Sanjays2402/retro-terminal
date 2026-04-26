# retro-terminal

A CRT-style interactive terminal that doubles as a portfolio page. Type commands to explore — just like the old days, but shinier.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-E91E63?logo=framer&logoColor=white)

---

## Features

- **Full CRT experience** — scanlines, phosphor glow, screen curvature, vignette, subtle flicker
- **BIOS-style boot sequence** — loading bars, hardware checks, "SYSTEM READY"
- ⌨️ **Interactive commands** — type to navigate the portfolio
- **4 color themes** — green phosphor, amber, ice blue, monochrome
- **Matrix rain easter egg** — follow the white rabbit
- **Command history** — up/down arrows to recall previous commands
- **Tab completion** — autocomplete command names as you type
- **Typing animation** — character-by-character output for that authentic feel
- █ **Blinking block cursor** — because this is a real terminal

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | List all available commands |
| `about` | Who am I — the about section |
| `skills` | Tech stack with visual proficiency bars |
| `projects` | Featured projects with descriptions |
| `contact` | Email, GitHub, LinkedIn links |
| `education` | Education history & certifications |
| `experience` | Work experience timeline |
| `neofetch` | System info in ASCII art style |
| `theme <color>` | Switch theme — `green` / `amber` / `blue` / `white` |
| `matrix` | Trigger Matrix digital rain |
| `clear` | Clear the terminal |
| `sudo rm -rf /` | Try it. I dare you. |

## Getting Started

```bash
# Clone
git clone https://github.com/Sanjays2402/retro-terminal.git
cd retro-terminal

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## Tech Stack

- **React 19** — UI components
- **Vite** — lightning-fast bundler
- **Tailwind CSS v4** — utility styling
- **Framer Motion** — smooth animations
- **JetBrains Mono** — the monospace font

## Themes

| Theme | Color | Hex |
|-------|-------|-----|
| Green | Phosphor Green | `#00ff41` |
| Amber | Classic Amber | `#ffb000` |
| Blue | Ice Blue | `#00d4ff` |
| White | Monochrome | `#f0f0f0` |

## Customization

All portfolio data lives in `src/data.js`. Edit the arrays to swap in your own info — about text, skills, projects, contact links, education, and experience.

## License

MIT
