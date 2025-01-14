
# Cryptocurrency Matchmaking and Ranking System

## Overview

This system processes cryptocurrency-related data to perform matchmaking, calculate rankings, and generate insights from user-generated actions like "buy" and "sell." It integrates data collection, processing, matchmaking, and advanced ranking algorithms using ELO-based methods.

---

## Features

### 1. Data Obtaining
Implemented in `data_obtaining.py`:
- **Fetch Cryptocurrency Data**: Retrieves data using APIs for historical price information.
- **Sentimental Data Extraction**: Pulls sentiment data from MongoDB collections.
- **Top Coin Identification**: Identifies top coins based on social media mentions.
- **Data Downloading**: Downloads coin-specific data for analysis.

### 2. Data Preprocessing
Implemented in `data_preprocessing.py`:
- **Timestamp Rounding**: Rounds timestamps to nearest intervals for consistency.
- **Sentiment Data Loading**: Cleans and prepares sentiment data for processing.
- **Tweet and Coin Data Merging**: Merges tweet sentiment data with coin price data.
- **Filtering**: Filters and refines the tweet table for relevant analysis.

### 3. Matchmaking and Ranking
Implemented in `matchmaking_and_ranking.py`:
- **Matchmaking**: Pairs participants based on their actions and calculates ELO ratings.
- **Ranking Finalization**: Generates a leaderboard with tiers (e.g., Grandmaster, Diamond).
- **Historical Analysis**: Provides detailed insights on past matches and trends.
- **Performance Metrics**: Calculates Sharpe ratio, maximum drawdown, and profit.

### 4. Main Workflow
Implemented in `main.py`:
- Combines data obtaining, preprocessing, and matchmaking into a cohesive pipeline.
- Generates outputs including leaderboards, match history, and performance metrics.

---

## Requirements

- Python 3.8 or later
- Required libraries:
  - pandas
  - numpy
  - plotly
  - matplotlib
  - tqdm
  - pymongo
  - requests

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cryptocurrency-ranking.git
   cd cryptocurrency-ranking
   ```

2. Install dependencies using `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the main script:
   ```bash
   python main.py
   ```

---

## Usage

1. **Data Downloading**:
   The system fetches data on cryptocurrencies, tweets, and sentiments.

2. **Preprocessing**:
   Prepares the data for matchmaking by merging and rounding timestamps.

3. **Matchmaking**:
   Performs matchmaking for participants and updates their rankings.

4. **Final Output**:
   - Match history: `match_history.json`
   - Leaderboard: `leader_board.json`
   - Player data: `kol_data.json`

---

## Outputs

- **Leaderboard** (`final_table.csv`): Ranks participants with metrics like ELO and win rate.
- **Historical Data** (`match_history.json`): Stores detailed match records.
- **Coin Insights** (`kol_data.json`): Provides in-depth analysis of user performance and trends.

---

## Key Functions

### `data_obtaining.py`
- `get_coin(symbol, ...)`: Fetches historical coin data.
- `get_sentimental_data(...)`: Extracts sentiment data from tweets.
- `downloading_top_coins(...)`: Downloads data for top-mentioned coins.

### `data_preprocessing.py`
- `create_tweet_table(...)`: Combines sentiment and price data for analysis.
- `filter_tweet_table(...)`: Filters tweets for relevant matches.

### `matchmaking_and_ranking.py`
- `matchmaking(...)`: Conducts matchmaking and ELO calculations.
- `finalizing(...)`: Creates the leaderboard with performance tiers.

### `main.py`
Orchestrates the entire workflow, combining data collection, preprocessing, matchmaking, and exporting results.

---

## Contribution

Contributions are welcome! Feel free to submit issues or pull requests to improve the system.

---

## License

This project is licensed under the MIT License.

---

## Requirements File (`requirements.txt`)

```plaintext
pandas
numpy
plotly
matplotlib
tqdm
pymongo
requests
```
