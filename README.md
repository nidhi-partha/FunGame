# 💗 Guess Who Said It

A pink, sorority-coded party game for friend groups. Someone drops an anonymous "confession," everyone else has to guess who said it while defending their guesses, and dodging the AI-generated bluff statements planted in the mix. Most correct guesses by the end wins. Results will be displayed along with a leaderboard to see who did best!

---

##Vibe / Theme

- **Color palette:** hot pink, blush, magenta, with white/gold accents (think sorority letters, rush week flyers, y2k-cute).
- **Tone:** playful, a little chaotic, a little judgmental — the game *wants* people to gasp and argue.
- **Voice:** copy should sound like a text from your funniest friend, not a corporate app. ("spill it 💅", "who tf said this", "the tea has been spilled")

---

##Roles

Host: Creates the game room, controls round pacing (e.g. advances to next question)
Player: Joins via room code or link, answers prompts, votes, debates.
| **The AI** | (Optional/advanced) Occasionally submits a fake "bluff" answer disguised as a real player's response. |

Accounts are optional for v1 — players can join with just a display name + room code. Accounts (future) would let the game remember your stats/history across sessions.

---

## 🕹️ How to Play

### 1. Create or Join a Room
- The **Host** starts a new game and gets a short **Room Code** (e.g. `PINK42`) and/or a shareable **link**.
- Everyone else opens the app/site and enters the room code (or taps the link) to join the lobby.
- Players pick a display name (and maybe an avatar/emoji) once inside.

### 2. Prompt Round
- The game generates a fill-in-the-blank style prompt, e.g.:
  > "I once ________ and never told anyone."
  > "The pettiest thing I've ever done is ________."
  > "I'm secretly really good at ________."
- **Everyone answers privately and simultaneously** on their own device — no one sees anyone else's answer yet.

### 3. The Reveal
- Once all answers are in, the game picks one submitted answer (anonymized) and displays it to the whole group:
  > **"I ________ [answer]"**
- This repeats round after round until everyone's (or a set number of) statements have been shown.

### 4. Vote + Debate (at the same time!)
- While the statement is on screen, players **simultaneously vote** on who they think said it, and **debate out loud / in chat** — accusations, alibis, deflections encouraged.
- **You can't vote for yourself** — if it's your own statement, you're excluded from voting that round (this also subtly signals who *didn't* vote, which is part of the fun/risk).
- A short timer keeps the round moving (e.g. 30–60 seconds).

### 5. The Bluff Twist 🎭
- Some statements shown aren't from a real player at all — they're **AI-generated bluff statements** designed to sound like something *someone in the group* would say.
- Players don't know in advance which rounds are bluffs. Guessing "this was a bluff, not a real person" is itself a valid (and separately scored) guess.
- *(Future idea: the AI crafts bluffs based on what it's learned about each player over time, making them harder to distinguish from the real thing.)*

### 6. Results
- After voting closes, the game reveals:
  - The **vote breakdown** (e.g. "3 votes for Nandini, 2 for Neeti, 1 for Bluff")
  - The **actual author** of the statement (or "It was a bluff!")
- Players who **guessed correctly** earn points.

### 7. Scoring
- **+1 point** for each correct guess (correctly identifying who said it, or correctly calling a bluff).
- Optional stretch rules (future): bonus points for stumping the whole room, or for a bluff-writer (the AI... or a designated human bluffer in a future mode) if nobody catches it.
- Running scoreboard is visible between rounds to keep the tension up.

### 8. Winning
- After a set number of rounds (host-configurable, e.g. 8–10 prompts), the game ends.
- The player with the **most points** wins and gets the big celebratory "you guessed the tea" moment.

---

## 🧩 Core Game Loop (Summary)

```
Host creates room → Players join via code/link
        ↓
Prompt generated → All players answer privately
        ↓
One statement revealed to group (maybe a bluff!)
        ↓
Players vote (not for themselves) + debate live
        ↓
Results shown: vote tally → true author revealed
        ↓
Points awarded for correct guesses
        ↓
Repeat for N rounds → Final scoreboard → Winner crowned 👑
```

---

## 🔮 Future Ideas

- **Persistent accounts** with stats/history across games (most wins, best bluff-detector, etc.)
- **Personalized AI bluffs** — the AI learns a player's voice/style over time and writes bluffs meant to specifically impersonate them.
- **Custom prompt packs** — spicy, wholesome, roommate-only, family-friendly, etc.
- **Reaction/emoji spam** during the debate phase.
- **Post-game recap card** — shareable, sorority-flyer-style image summarizing the game (MVP guesser, most-voted-for mystery person, etc.)
- **Human bluffer mode** — instead of AI, one designated player secretly writes a fake answer each round.

---

## ❓ Open Questions

- Should self-authored statements be skippable entirely for the author (auto-hidden from their own vote screen), or just non-selectable?
- How many total rounds per game feels best — fixed count, or "one statement per player"?
- Minimum/maximum player count for a fun game (e.g. 4–12)?
- Do accounts unlock anything beyond stats (e.g. custom avatars, saved friend groups/rooms)?
