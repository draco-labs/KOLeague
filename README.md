![image](https://github.com/user-attachments/assets/2f2d1426-6fe8-4ec9-b6a5-6fa1fbbc0fa5)

# KOLeague

KOLeague is an AI-powered decision-making agent designed to analyze market trends, rank Key Opinion Leaders (KOLs), and provide insights based on social media sentiment and critical thinking frameworks.

## Features
- **KOL Ranking Algorithm**: Evaluates and ranks KOLs based on their market predictions and social influence.
- **Social Insight Extraction**: Collects and analyzes market sentiment from various sources.
- **Critical Thinking Framework**: Uses AI to simulate internal debates and make data-driven decisions.
- **On-Chain Integration**: Connects with decentralized exchanges (DEX) to highlight trending tokens.
- **Web Client**: Provides a user-friendly interface for interaction with the AI agent.

## Folder Structure
KOLeague is structured into multiple independent modules. Each module must be used separately by navigating to its respective directory.

- [`kol_ranking`](https://github.com/draco-labs/KOLeague/tree/main/kol_ranking): Implements the KOL ranking algorithm by evaluating influencers based on credibility and market accuracy.
- [`agent/autogen-framework`](https://github.com/draco-labs/KOLeague/tree/main/agent/autogen-framework): Uses AutoGen to facilitate AI-driven interactions for market insights.
- [`agent/eliza-framework`](https://github.com/draco-labs/KOLeague/tree/main/agent/eliza-framework): Provides a conversational agent based on the ELIZA framework for market discussions.
- [`onchain_toolkit`](https://github.com/draco-labs/KOLeague/tree/main/onchain_toolkit): Analyzes on-chain data and provides insights into trending token swaps.
- [`webclient`](https://github.com/draco-labs/KOLeague/tree/main/webclient): A front-end interface to interact with the KOLeague AI.

## Installation & Usage
Each module operates independently. To use a specific module, navigate to its directory and follow its README instructions.

### Example:
To use the **KOL Ranking Algorithm**:
```bash
cd kol_ranking
pip install -r requirements.txt
python rank_kols.py
```

To use the **On-Chain Toolkit**:
```bash
cd onchain_toolkit
pip install -r requirements.txt
python analyze_swaps.py
```

For other modules, refer to their respective README files for specific usage instructions.

## Contribution
Contributions are welcome! If you'd like to improve KOLeague, submit a pull request or open an issue.

## License
KOLeague is open-source under the MIT License.

