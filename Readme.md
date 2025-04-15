# FocusStack - Smart Daily Planner for Tech Students

![FocusStack Logo](https://via.placeholder.com/150x150?text=FocusStack)

FocusStack is a productivity planner designed specifically for students in tech (especially cloud/devops learners). It helps users break big goals into small daily tasks with a clean, intuitive interface.

## 🚀 Live Demo

[View Live Demo](https://smart-daily-planner.vercel.app/) 

## ✨ Features

| Feature | Description |
|--------|-------------|
| 📆 **Daily Smart Planner** | Organize and visualize your day with time-based tasks |
| ⏰ **Time Blocking** | Visual time blocks to see your day at a glance |
| ✅ **Task Management** | Add, edit, delete and mark tasks as complete |
| 🔄 **Drag & Drop** | Reorder tasks with intuitive drag and drop functionality |
| 📊 **Progress Tracking** | Visual progress bar and completion statistics |
| 🔍 **Task Filtering** | Filter tasks by category (Work, Study, Personal, Coding) |
| 🧠 **Focus Mode** | Distraction-free UI with Pomodoro timer for deep work |
| ⌨️ **Keyboard Shortcuts** | Quick access to common functions |
| 💾 **Data Persistence** | Tasks automatically saved to local storage |
| 🌓 **Light/Dark Theme** | Automatically matches your system preferences |

## 🛠️ Tech Stack

- **Frontend Framework**: Vanilla TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS variables for theming
- **Storage**: Browser LocalStorage for data persistence
- **Deployment**: Vercel
- **Version Control**: Git/GitHub

## 📋 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gaurikarkhile001/Smart-Daily-Planner.git
   cd focusstack
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`

## 🚢 Deployment

This project is configured for easy deployment to Vercel:

1. Fork/clone this repository to your GitHub account
2. Sign up for [Vercel](https://smart-daily-planner.vercel.app/)
3. Create a new project and import your GitHub repository
4. Vercel will automatically detect the Vite configuration
5. Deploy!

## 🧩 Project Structure

```
focusstack/
├── src/                # Source files
│   ├── main.ts         # Main application logic
│   ├── task.ts         # Task model and definitions
│   └── style.css       # Application styling
├── public/             # Static assets
├── index.html          # HTML entry point
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## 💻 How It Works

FocusStack helps you organize your day with a few simple concepts:

1. **Tasks**: Add tasks with a time, description, and category
2. **Time Blocks**: Visualize your day with color-coded time blocks
3. **Focus Mode**: Enter distraction-free mode with a Pomodoro timer for deep work
4. **Progress Tracking**: See your daily progress with visual indicators

### Key Features in Action

**Task Management**:
- Add tasks with the form at the top
- Check off completed tasks
- Edit or delete tasks by clicking on the action buttons
- Reorder tasks by dragging them to a new position

**Focus Mode**:
- Toggle focus mode by clicking the "Focus Mode" button
- Use the Pomodoro timer for focused work sessions
- Return to normal mode when you're done

**Keyboard Shortcuts**:
- `N` - New Task (focus on task input)
- `F` - Toggle Focus Mode
- `S` - Save All Tasks

## 🔜 Future Roadmap

- Cloud synchronization across devices
- User accounts and authentication
- GitHub/Google Calendar integration
- AI-powered task suggestions
- Mobile application
- Weekly planning view
- Customizable categories
- Export/import data

## 📱 Mobile Support

FocusStack is fully responsive and works on all device sizes:
- Desktop: Full-featured experience
- Tablet: Optimized layout for medium screens
- Mobile: Streamlined interface for on-the-go planning

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Built with [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/)
- Deployed on [Vercel](https://vercel.com)
- Icons provided by [System UI Icons](https://systemuicons.com/)

---

Made with ❤️ by [Your Name]
