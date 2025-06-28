# Polygons App

### Quick Start

#### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd assignment-no-tr

cd app
pnpm install

cd backend
pnpm install

cd "frontend"
pnpm install
```

#### Running the Application

**Backend:**

```bash
pnpm docker:up
cd backend
pnpm dev
```

🌐 API Documentation: `http://localhost:3100/`

🌐 Postgress Client: `http://localhost:8080/`

**Frontend:**

```bash
cd frontend
pnpm dev
```

🎨 **Application:** `http://localhost:3000`

### Testing

<div align="left">

| Test Type               | Command          | Description                                                                            |
| ----------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| 🧪 **Unit Tests**       | `pnpm test`      | Run comprehensive test suites                                                          |
| 🔌 **API Tests**        | Multiple formats | cURL, HTTPie, Insomnia, VSCode REST [`app/backend/api-tests/`](app/backend/api-tests/) |
| 🎯 **Vitest Extension** | IDE Integration  | Real-time test execution                                                               |

</div>

### Development

> 💡 **Pro Tip:** Install recommended VSCode extensions for the best development experience

### Backend Architecture

Built on the robust [Express TypeScript Boilerplate by GeekyAnts](https://github.com/GeekyAnts/express-typescript)

#### Architecture Highlights

**🎯 Modular Design**

- 🛣️ **Routes** - API endpoint definitions
- 🎮 **Controllers** - Request/response handling
- ⚙️ **Services** - Business logic layer
- 🗄️ **Repositories** - Data access layer

**🛡️ Built-in Middleware**

- 📝 Request logging
- ❌ Error handling
- 🚦 Rate limiting

### Frontend Architecture

#### Technology Choices

**🏗️ Build Tool (rspack)**

- ⚡ Lightning-fast build speeds
- 🌟 Excellent community support
- 🔧 Comprehensive capabilities

**⚛️ Framework (React)**

- 🌍 Widespread adoption
- 🏗️ Rich ecosystem
- 👥 Developer familiarity

**💅 Styling (styled-jsx)**

- 🎯 Component-scoped styling
- 🤖 AI-supported
- 🔧 Rsbuild integration

<div align="center">

**Built with ❤️ using modern web technologies**

_TypeScript • React • Express.js • OpenAPI • Vitest_

</div>
