
# Matchmaking and Ranking System

## Overview

This Python script implements a matchmaking and ranking system, primarily designed for analyzing and processing user-generated data (e.g., tweets related to cryptocurrency trading). It uses ELO rating-based algorithms to evaluate participants' performance and updates scores based on their activity outcomes.

Key features include:
- Matchmaking based on user actions (e.g., "buy" and "sell").
- ELO-based ranking adjustments.
- Leaderboard generation and ranking tiers.
- Historical match analysis.
- Data export for visualization and further processing.

---

## Features

### 1. Matchmaking
- Groups user actions (e.g., tweets) by coin and date.
- Matches "buy" and "sell" users into pairs and calculates ELO changes based on their results.
- Supports balancing teams with placeholder "BOT" players if groups are uneven.

### 2. Ranking System
- Calculates ELO ratings before and after each match.
- Updates user ratings and tracks ranking changes over time.

### 3. Data Finalization
- Generates leaderboards with metrics such as win rate, total matches, and buy/sell actions.
- Categorizes users into tiers: Grandmaster, Master, Diamond, Platinum, Gold, Silver, and Bronze.

### 4. Historical Analysis
- Provides historical match data for individual participants.
- Includes win/loss records, recent ELO trends, and coin-specific performance.

### 5. Data Export
- Exports results as CSV and JSON files:
  - Match history (`match_history.json`).
  - Leaderboard (`leader_board.json`).
  - Player-specific data (`kol_data.json`).

---

## Requirements

- Python 3.8 or later
- Required Python libraries:
  - pandas
  - numpy
  - plotly
  - matplotlib
  - tqdm
  - pymongo

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/matchmaking-and-ranking.git
   cd matchmaking-and-ranking
   ```

2. Install dependencies using `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the script:
   ```bash
   python matchmaking_and_ranking.py
   ```

---

## Usage

### Inputs
The script requires the following inputs:
- **Filtered tweets data (`filtered_tweets`)**: User actions grouped by coin and date.
- **ELO data (`elo_df`)**: Current ratings for all participants.
- **Match history (`match_df`)**: A DataFrame to store match results.

### Execution
Run the script to perform matchmaking, update rankings, and generate outputs:
```python
python matchmaking_and_ranking.py
```

### Outputs
- **Match Data**: `match.csv`
- **Leaderboard**: `final_table.csv`, `leader_board.json`
- **Historical Data**: `match_history.json`, `kol_data.json`

---

## Functions

### `matchmaking(filtered_tweets, elo_df, match_df, match_id_initiate)`
Performs matchmaking and updates ELO ratings.

### `finalizing(match_df)`
Generates the final leaderboard and calculates user metrics.

### `match_history_to_json(match_df_origin, coin_dict)`
Converts match history to JSON format for further analysis.

### `generate_open_interest_data(coin, target_date, day_set=7)`
Generates open interest data for the specified coin and date range.

### `add_parameter(match_df, final_table)`
Calculates additional performance metrics, including Sharpe ratio and maximum drawdown.

---

## Examples

### Matchmaking and Ranking
```python
match_results = matchmaking(filtered_tweets, elo_df, match_df, 1)
```

### Finalize Leaderboard
```python
final_table, match_df_origin = finalizing(match_results)
```

### Export Match History
```python
match_history_to_json(match_df_origin, coin_dict)
```

---

## Contribution

Feel free to suggest improvements or report issues. Contributions to improve the matchmaking logic or ranking system are welcome.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Requirements File (`requirements.txt`)

```plaintext
pandas
numpy
plotly
matplotlib
tqdm
pymongo
```
