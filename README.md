# 🎴 Flip the Twin – React Memory Card Game

A fast-paced **memory flip game** built with **React**, featuring glowing Pepsi-themed visuals, animated starfield background, and support for different grid sizes (4×4, 6×6, 8×8).  
Match pairs before the timer runs out and test your memory skills!

![Gameplay Preview](./docs/screenshots/gameplay.gif)

---

## ✨ Features

- ⚛️ Modern **React** (CRA/Vite compatible)
- 🎨 **Pepsi Electric theme** with glowing colors and animated starfield background
- 🃏 **Custom card system**:
  - Font glyphs via `GeneralFoundicons`
  - Or product images / text symbols
- ⏱️ **Timed gameplay** with pause & abandon support
- 📊 **Local stats tracking** (wins, losses, abandoned games, best times, matched vs wrong flips)
- 🎉 **Congratulations popup** with fun GIF when you win
- 📱 **Responsive design** (works across desktop & mobile)
- ♿ Basic accessibility (`role="button"`, keyboard shortcuts)

---

## 🕹️ Gameplay

- Flip cards by clicking on them
- Find two matching symbols to eliminate them
- Clear the entire grid **before the timer ends** to win
- Controls:
  - Press **P** to pause
  - Press **ESC** to abandon game and return to menu

Grid options:
- **4×4 (16 cards)**
- **6×6 (36 cards)**
- **8×8 (64 cards)**

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- npm or yarn

### Installation
```bash
# Clone the repo
git clone https://github.com/your-username/flip-match-react.git
cd flip-match-react

# Install dependencies
npm install

# Start development server
npm run dev   # (Vite)
# or
npm start     # (Create React App)
