# KOLeague

## Project Description

### Core Concept
**KOLeague** is an advanced multi-agent system designed to analyze social sentiment and on-chain metrics, providing valuable insights for research and decision-making. Built on the **Starknet** blockchain, KOLeague offers a seamless integration of functionalities, ranging from trading to asset management, ensuring a comprehensive toolkit for users.

---

## Main Features

### **Multi-Agent System**
KOLeague leverages a network of specialized agents to streamline operations and enhance decision-making. These agents include:

1. **Social Agent**  
   - **Purpose**: Acts as a virtual investor, analyzing social media posts and ranking Key Opinion Leaders (KOLs).
   - **Key Features**:
     - **Content Analysis**: Reads social media posts and interprets investment suggestions (buy/sell) from KOLs.
     - **KOL Scoring**: Ranks KOLs using the ELO ranking algorithm based on the accuracy and consistency of their market predictions. League Points (LP), derived from the ELO system, serve as performance indicators.
     - **Market Sentiment Analysis**: Identifies market trends by analyzing top-ranked KOLs and provides users with trusted financial insights.
   - **Output**: Offers investment suggestions grounded in social sentiment and the advice of high-ranking KOLs.

2. **On-Chain Agent**  
   - **Purpose**: Analyzes Starknet blockchain data to uncover token swap opportunities and provide on-chain insights.
   - **Key Features**:
     - **Data Crawling**: Fetches real-time on-chain data, focusing on token swap activities.
     - **Opportunity Detection**: Identifies promising token pairs for swaps based on recent trends and performance.
     - **Analytics**: Provides additional insights, including total transactions and swapping volumes within the last 24 hours.

3. **Executive Agent**  
   - **Purpose**: Executes token swaps based on user instructions.
   - **Key Features**:
     - **Request Listener**: Processes trade requests and identifies the appropriate token contracts for swaps.
     - **Trade Execution**:
       - Executes swaps autonomously using predefined parameters.
       - Offers manual confirmation for user-initiated trades.
     - **Security**: Ensures safe and verified trade execution on the Starknet blockchain.

4. **Master Agent**  
   - **Purpose**: Serves as the primary interface for users and coordinates the activities of all agents.
   - **Key Features**:
     - **User Interaction**: Interprets user queries and requests.
     - **Task Assignment**: Delegates tasks to the appropriate agents:
       - Social sentiment analysis → **Social Agent**
       - On-chain data analysis → **On-Chain Agent**
       - Trade execution → **Executive Agent**

---

### **DeFi Toolkit for Starknet**
KOLeague includes a comprehensive DeFi toolkit to enhance asset management and trading capabilities:
- **Connect and Create Wallet**: Facilitates secure wallet creation and connection to the Starknet ecosystem.
- **View Balance**: Displays real-time wallet balances for effective portfolio management.
- **Token Transfer**: Enables secure and efficient token transfers within the Starknet network.
- **Token Swap on Ekubo DEX**: Simplifies token swaps directly on **Ekubo DEX** for seamless trading.

---

## Technical Foundation
KOLeague’s multi-agent system is built on **[ElizaOS](https://github.com/elizaOS)**, a robust framework for agent-based systems. Each agent operates autonomously while collaborating to achieve a unified user experience.

---

## Key Highlights
- **Social Sentiment Analysis**: Gain insights into market trends from top KOLs.
- **On-Chain Analytics**: Discover actionable trading opportunities with detailed on-chain metrics.
- **Automated Trading**: Execute token swaps efficiently using a secure DeFi toolkit.
- **Comprehensive Integration**: Leverage the Starknet blockchain for secure and scalable solutions.
