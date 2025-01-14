
# Elo Rank Module

The Elo Rank module is a component of the StarkNest project that implements the Elo rating system for ranking KOLs in competitive games. The Elo rating system is a method for calculating the relative skill levels of KOLs in zero-sum games such as chess.

## Features

- **KOL Rating Management**: Maintain and update KOL ratings based on game outcomes.
- **Match Outcome Processing**: Calculate expected scores and adjust KOL ratings accordingly.
- **Customizable Parameters**: Configure parameters such as the K-factor to control rating volatility.

## Elo Rating Formula

The Elo rating formula is used to calculate the expected outcome and update KOL ratings:

1. **Expected Score**:
   The expected score for a KOL is calculated using the following formula:
   \[
   E_A = \frac{1}{1 + 10^{(R_B - R_A) / 400}}
   \]
   Where:
   - \( E_A \): Expected score of KOL A
   - \( R_A \): Current rating of KOL A
   - \( R_B \): Current rating of KOL B

2. **Rating Update**:
   After a match, the ratings are updated using the formula:
   \[
   R'_A = R_A + K \times (S_A - E_A)
   \]
   Where:
   - \( R'_A \): New rating of KOL A
   - \( R_A \): Current rating of KOL A
   - \( K \): K-factor (a constant controlling the rating adjustment magnitude)
   - \( S_A \): Actual score of KOL A (1 for win, 0.5 for draw, 0 for loss)
   - \( E_A \): Expected score of KOL A

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/draco-labs/StarkNest.git
   cd StarkNest/elo_rank
   ```

2. **Install Dependencies**:

   Ensure you have the necessary dependencies installed. You can install them using pip:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Import the Module**:

   In your Python script, import the Elo Rank module:

   ```python
   from elo_rank import EloRank
   ```

2. **Initialize the EloRank Class**:

   Create an instance of the `EloRank` class:

   ```python
   elo = EloRank()
   ```

3. **Update KOL Ratings**:

   After a match, update the KOL ratings based on the outcome:

   ```python
   KOL_a_rating = 1600
   KOL_b_rating = 1500
   result = 1  # 1 if KOL A wins, 0 if KOL B wins, 0.5 for a draw

   new_a_rating, new_b_rating = elo.update_ratings(KOL_a_rating, KOL_b_rating, result)
   ```

## Configuration

You can customize the behavior of the Elo rating calculations by adjusting parameters in the `EloRank` class:

- **K-factor**: Determines the maximum possible adjustment per game.

  ```python
  elo = EloRank(k_factor=32)
  ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## Acknowledgments

The Elo rating system was developed by Arpad Elo. For more information, refer to the [Wikipedia article on the Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system).

---

*Note: This module is part of the StarkNest project. For more information, visit the [main repository](https://github.com/draco-labs/StarkNest).*

