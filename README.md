# AI-Powered Web Support Agent 🤖

An intelligent system that can answer questions about any website by scraping content, creating vector embeddings, and leveraging large language models to generate contextual responses.

## 🌟 Features

- **Web Scraping**: Extract content from any website using Cheerio
- **Vector Embeddings**: Convert text to vector embeddings for semantic search
- **Vector Database**: Store and retrieve content efficiently using Pinecone
- **LLM Integration**: Generate natural, contextual responses based on retrieved information

## 📋 How It Works

1. The system scrapes webpage content and stores it in chunks
2. Content is converted to vector embeddings for semantic search capability
3. When a user asks a question, the system:
   - Converts the question to an embedding
   - Finds the most relevant content in the vector database
   - Uses an LLM to generate a human-like response based on the retrieved context

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- Docker (for running Pinecone local)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codexharoon/ai_webpage_support.git
   cd ai_webpage_support

## 💡 Use Cases

- Create instant customer support chatbots
- Build FAQ systems that understand user intent
- Develop knowledge base assistants for documentation
- Enhance website search with semantic understanding

## 🔧 Project Structure

- `index.js` - Main application file
- `pinecone.js` - Pinecone vector database configuration
- `docker-compose.yaml` - Docker configuration for Pinecone local
- `.env` - Environment variables for API keys

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📬 Contact

Have questions or want to collaborate? Reach out at info@codexharoon.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by Code x Haroon.
