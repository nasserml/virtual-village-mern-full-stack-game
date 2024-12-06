# ✨ Virtual Village: A Multiplayer Online Adventure 🏞️

Welcome to Virtual Village, a captivating multiplayer online game built with a modern MERN (MongoDB, Express, React, Node.js) stack!  This project allows players to interact in a dynamic, shared virtual world.  Navigate the arena, explore various spaces, and customize your experience with unique avatars.

## 🚀 Getting Started

Follow these steps to embark on your Virtual Village journey:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/virtual-village-mern-full-stack-game.git
   ```
2. **Install Dependencies:**
   ```bash
   cd virtual-village-mern-full-stack-game
   pnpm install
   ```
3. **Set Up the Database:**
   Ensure you have PostgreSQL installed and configured.  Update the `DATABASE_URL` environment variable in your `.env` file with the connection string to your database.  Apply the Prisma schema:
   ```bash
   pnpm prisma db push
   ```
4. **Run the Development Servers:**
   ```bash
   pnpm dev
   ```
   This will start the HTTP server (port 3000) and the WebSocket server (port 3001).


## 🎮 Features

* **Multiplayer Interaction:**  Real-time interactions with other players within shared spaces. 👥
* **Space Creation and Management:** Design and personalize your own spaces within the village. 🏠
* **Avatar Customization:** Choose from a variety of avatars to represent yourself in the game. 🧑‍🎤
* **Interactive Elements:**  Interact with various elements placed within spaces. 🌳
* **Admin Controls:** Manage elements, avatars, and maps with administrative privileges. 👮
* **Comprehensive Test Suite:** Robust testing ensures a stable and reliable gaming experience. ✅
* **WebSockets for Real-time Communication:** Seamless communication between players and the server. 📡

## 💻 Technologies Used

* **Frontend:** React, TypeScript, Vite ⚛️
* **Backend:** Node.js, Express.js ⚙️
* **Database:** PostgreSQL, Prisma 🗄️
* **Real-time Communication:** WebSockets 🌐
* **Testing:** Jest, Axios 🧪
* **Authentication:** JWT (JSON Web Tokens) 🔐


## 📂 Project Structure

```
virtual-village-mern-full-stack-game/
├── packages/     # Shared packages
│   ├── db/       # Database client using Prisma
│   ├── eslint-config/ # ESLint configuration
│   ├── typescript-config/ # TypeScript configuration
│   └── ui/      # React component library
└── apps/       # Applications
    ├── frontend/ # React frontend application
    ├── http/     # Express.js HTTP server
    └── ws/       # WebSocket server
```

## 🧪 Testing

A comprehensive test suite has been developed using Jest and Axios. Run tests with:

```bash
cd tests
pnpm test
```

## 📜 Data Model

The application uses a well-defined data model with the following entities:

* **User:** Stores user information including username, password, role, and selected avatar.
* **Avatar:** Holds avatar data such as image URL and name.
* **Element:** Represents interactive elements within a space, with properties like width, height, and image URL.
* **Space:** Defines a specific area within the virtual village, with dimensions, thumbnail, and associated elements.
* **Map:**  Represents a pre-designed layout for a space, containing default element placements.
* **mapElements & spaceElements:**  Junction tables linking elements to maps and spaces, respectively.


## 🙏 Credits & Acknowledgements

This project was built following this excellent tutorial: [Build a Full Stack Multiplayer Online Game with MERN (MongoDB, Express, React, Node.js)](https://www.youtube.com/watch?v=aamk2isgLRk).  Thank you for the invaluable guidance! 💖

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues and submit pull requests.


## 📄 License

This project is licensed under the [MIT License](LICENSE). Enjoy building your Virtual Village! 🎉
