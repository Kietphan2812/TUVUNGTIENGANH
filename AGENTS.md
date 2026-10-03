# Agent instructions for this repo

This project is a single-page English vocabulary quiz app built in plain HTML, CSS, and JavaScript.

## Project purpose
- Help learners practice English vocabulary through multiple-choice questions.
- The page should remain lightweight and fully static.
- The app should work by opening `index.html` in a browser without any build tools or package installs.

## Working conventions
- Prefer small, focused edits in `index.html`.
- Keep styling and behavior self-contained; do not add frameworks or dependencies unless explicitly requested.
- Preserve the existing visual identity: dark navy theme, yellow accent, pink quiz cards, and festive motion effects.
- Keep Vietnamese labels and user-facing messaging consistent with the current app tone and content.
- If changing quiz data, maintain the structure of each question as `{ word, options, correct }`.

## Validation
- After significant UI or logic changes, open the page in a browser and verify that:
  - questions render correctly,
  - answers can be selected,
  - scoring updates,
  - submit and restart flows work,
  - the audio pronunciation feature does not throw errors.

## Files
- `index.html` — full app markup, styling, and logic
- `nhac1.mp3` — background audio asset

## Do not do
- Do not introduce a build system or Node dependencies for a simple static page.
- Do not remove the existing quiz structure or score submission flow without a clear requirement.
- Do not add large third-party libraries unless requested.
