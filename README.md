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

## Terms & Disclaimer

By using this project you agree to the following.

- **No warranty.** This software is provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
- **No liability.** To the maximum extent permitted by law, the author and contributors are not liable for any claim, loss, or damage (direct, indirect, incidental, or consequential, including lost data or profits) arising from its use.
- **Your responsibility.** You use it at your own risk and are responsible for complying with the laws that apply to you.
- **Third parties.** Names, logos, APIs, and services of others belong to their owners and are used for identification only; no affiliation or endorsement is implied.
- **Your statutory rights.** Nothing here limits rights that cannot be waived by agreement, including under consumer-protection laws in the USA, Canada (including Quebec), and India (Consumer Protection Act, 2019).
- **License.** Use, copying, and distribution are governed by the [LICENSE](LICENSE) file; if anything here conflicts with it, the license controls.

## Content, Assets & Fair Use

- **Original work.** Unless noted otherwise (including below), the code, text, design, and images in this repository were created by the author.
- **Libraries, fonts, and icons.** Third-party libraries, fonts (for example Google Fonts), and icon sets belong to their creators and are used under their own licenses; see the dependency manifests and each source for terms.
- **Logos, brands, and screenshots.** Third-party names, logos, and screenshots appear only to identify or describe their products (nominative use). They remain the property of their owners and do not imply affiliation or endorsement.
- **Ideas and inspiration.** Where this project is inspired by another product, game, or idea, it is an independent implementation. It borrows only general ideas, mechanics, or styles, which are not anyone's exclusive property, and is meant to contain no third-party code or artwork used without permission.
- **Fair use and fair dealing.** Any third-party material is used in limited ways for purposes such as education, research, review, commentary, or identification, relying on fair use in the USA (17 U.S.C. § 107), fair dealing in Canada (Copyright Act, ss. 29–29.2), and fair dealing in India (Copyright Act, 1957, s. 52), where they apply.
- **Concerns and takedown requests.** If you own rights in something here and believe it is used improperly, [open an issue](https://github.com/Sanjays2402/retro-terminal/issues) or contact the author through their GitHub profile with a link to the material and your claim. It will be reviewed promptly and credited, changed, or removed as appropriate. You may also use GitHub's DMCA process.
- **Contributions.** By contributing, you confirm you have the right to submit your contribution and agree it is licensed under this repository's license.
- **Website.** The project site has its own [Terms](https://sanjays2402.github.io/retro-terminal/terms.html) and [Fair Use](https://sanjays2402.github.io/retro-terminal/fair-use.html) pages.
