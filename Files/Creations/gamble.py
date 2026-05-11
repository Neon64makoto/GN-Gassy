import random
import time
import json
import os
import base64 # Keep base64 for potential future use or just as an unused import

# --- Constants ---
SAVE_VERSION = 3 # Increment save version as we're changing game rules
STREAK_SAVER_PRICE = 1500
WORK_COOLDOWN_SECONDS = 30
WORK_PAYOUT = 500
BILL_AMOUNT = 1000
BILL_FREQUENCY_SECONDS = 120
BLANK_LINES_FOR_CLEAR = 50 # Number of blank lines to print
DEALER_STAND_THRESHOLD = 17
BLACKJACK_THRESHOLD = 21

# --- Helper Function to Clear Screen ---
def clear_screen():
    """Clears the terminal screen using platform-specific commands."""
    os.system('cls' if os.name == 'nt' else 'clear')

# --- Game State Class ---
class BlackjackGame:
    def __init__(self):
        self.is_started = False
        self.player_hand = []
        self.dealer_hand = []
        self.money = 1000
        self.streak = 0
        self.longest_streak = 0
        self.has_streak_saver = False
        self.wins = 0
        self.losses = 0
        self.draws = 0
        self.last_work_time = 0
        self.family_alive = True
        self.last_bill_time = time.time() # Initialize on script start
        self.bet = 0 # Bet is now part of the game state
        self.cheat = 0

    def give_money(self):
        while True:
            try:
                user_cheat = int(input("Enter amount: ").strip())
                if user_cheat <= 0:
                    print("Must be greater than 0.")
                else:
                    self.cheat = user_cheat  # Use '=' not '=='
                    self.money += self.cheat
                    break
            except ValueError:
                print("Please enter a valid number.")
        print("Money:", self.money)


    def reset(self):
        """Resets the game state to initial values."""
        self.__init__() # A simple way to reset all attributes

    def get_state(self):
        """Returns the current game state as a dictionary for saving."""
        return {
            "version": SAVE_VERSION,
            "money": self.money,
            "streak": self.streak,
            "longest_streak": self.longest_streak,
            "has_streak_saver": self.has_streak_saver,
            "wins": self.wins,
            "losses": self.losses,
            "draws": self.draws,
            "last_work_time": self.last_work_time,
            "family_alive": self.family_alive,
            "last_bill_time": self.last_bill_time
        }

    def load_state(self, state):
        """Loads game state from a dictionary."""
        loaded_version = state.get("version", 0)
        # Handle version mismatch - for this specific rule change, we might need
        # to warn the user that Ace handling is different.
        if loaded_version != SAVE_VERSION:
            print(f"Warning: Save version mismatch. Loaded v{loaded_version}, expected v{SAVE_VERSION}. Ace handling rules may differ.")
            # If you had major data structure changes, you might need migration logic here.

        # Load all variables using .get() for robustness
        self.money = state.get("money", 1000)
        self.streak = state.get("streak", 0)
        self.longest_streak = state.get("longest_streak", 0)
        self.has_streak_saver = state.get("has_streak_saver", False)
        self.wins = state.get("wins", 0)
        self.losses = state.get("losses", 0)
        self.draws = state.get("draws", 0)
        self.last_work_time = state.get("last_work_time", 0)
        self.family_alive = state.get("family_alive", True)
        self.last_bill_time = state.get("last_bill_time", time.time())

        print("Loaded state!")
        self.show_stats() # Show stats after loading

    def calculate_hand_total(self, hand):
        """Calculates the total of a hand based on the numbers in the list."""
        return sum(hand)

    def deal_card_player(self):
        """Deals a card to the player, asking for Ace value if needed."""
        card = random.randint(1, 11)
        if card == 1 or card == 11:
            while True:
                choice = input(f"You drew an Ace ({card}). Do you want it to count as 1 or 11? ").strip()
                if choice == '1':
                    return 1
                elif choice == '11':
                    return 11
                else:
                    print("Invalid choice. Please enter 1 or 11.")
        return card

    def deal_card_dealer(self):
        """Deals a card to the dealer. Ace (11) is taken as face value."""
        # Dealer only deals 1-10 and Ace (11)
        card = random.randint(1, 11)
        # For the dealer, 1 is treated as 1 and 11 is treated as 11 directly.
        # No need to ask for choice.
        if card == 1:
             return 1 # Dealer takes 1 as 1
        return card # Dealer takes other values as is, including 11 for Ace


    def handle_win(self):
        self.money += self.bet
        self.wins += 1
        self.streak += 1
        if self.streak > self.longest_streak:
            self.longest_streak = self.streak
        print("You win!")
        print("Money:", self.money)
        print("Current streak:", self.streak)
        print("Longest streak:", self.longest_streak)
        self.is_started = False # End the game round

    def handle_loss(self):
        if not self.has_streak_saver:
            self.streak = 0
        self.money -= self.bet
        self.losses += 1
        print("You lose.")
        print("Money:", self.money, "Streak reset to 0." if not self.has_streak_saver else f"Streak preserved due to Streak Saver!")
        print("Current streak:", self.streak)
        print("Longest streak:", self.longest_streak)
        self.is_started = False # End the game round

    def handle_draw(self):
        self.draws += 1
        print("It's a tie! No change to streak.")
        print("Money:", self.money)
        print("Current streak:", self.streak)
        self.longest_streak = max(self.longest_streak, self.streak)
        print("Longest streak:", self.longest_streak)
        self.is_started = False # End the game round

    def start_game(self):
        if not self.family_alive:
            print("Your family is gone. There's nothing left to play for...")
            return

        if self.money <= 0:
            print("You're out of money! Use the 'work' command to earn some cash.")
            return

        self.is_started = True
        self.player_hand.clear()
        self.dealer_hand.clear()
        self.bet = 0
        print("\nGame started!")
        print("Money:", self.money)

        while True:
            try:
                user_bet = int(input("Enter bet: ").strip())
                if user_bet > self.money:
                    print("You can't bet more than you have.")
                elif user_bet <= 0:
                    print("Bet must be greater than 0.")
                else:
                    self.bet = user_bet
                    break
            except ValueError:
                print("Please enter a valid number.")

        # Deal initial hands using the new deal_card methods
        self.player_hand.append(self.deal_card_player())
        self.dealer_hand.append(self.deal_card_dealer())
        self.player_hand.append(self.deal_card_player())
        self.dealer_hand.append(self.deal_card_dealer())


        player_total = self.calculate_hand_total(self.player_hand)
        dealer_total = self.calculate_hand_total(self.dealer_hand)

        print("Your hand:", self.player_hand, "Total:", player_total)
        # Show the first dealer card's actual value
        print("Dealer's hand:", [self.dealer_hand[0], "?"], "Total:", self.dealer_hand[0])

        # Note: With this Ace handling, Blackjack (21 with two cards) is less likely
        # unless the player gets a 10/face card and chooses 11 for the Ace.
        # The instant win/loss on 21 logic might need adjustment depending on how strictly
        # you want to interpret "Blackjack" with this new rule set.
        # For simplicity, we'll keep the instant win/loss on 21 for now.
        if player_total == BLACKJACK_THRESHOLD and dealer_total == BLACKJACK_THRESHOLD:
            print("Both have 21! It's a push.")
            self.handle_draw()
        elif player_total == BLACKJACK_THRESHOLD:
            print("You have 21! You win instantly!")
            self.handle_win()
        elif dealer_total == BLACKJACK_THRESHOLD:
            print("Dealer has 21! Dealer wins instantly.")
            self.handle_loss()


    def hit(self):
        if not self.is_started:
            print("Please start the game first!")
            return
        if not self.family_alive:
             print("Your family is gone. There's nothing left to play for...")
             self.is_started = False # End the game round if family is gone
             return

        print("You chose to hit.")
        self.player_hand.append(self.deal_card_player()) # Use player dealing
        player_total = self.calculate_hand_total(self.player_hand)

        print("Your hand:", self.player_hand, "Total:", player_total)
        print("Dealer's hand:", [self.dealer_hand[0], "?"], "Total:", self.dealer_hand[0])

        if player_total > BLACKJACK_THRESHOLD:
            print("You busted!")
            self.handle_loss()

    def stand(self):
        if not self.is_started:
            print("Please start the game first!")
            return
        if not self.family_alive:
             print("Your family is gone. There's nothing left to play for...")
             self.is_started = False # End the game round if family is gone
             return

        print("You chose to stand.")

        dealer_total = self.calculate_hand_total(self.dealer_hand)
        player_total = self.calculate_hand_total(self.player_hand)

        print("Dealer reveals hand:", self.dealer_hand, "Total:", dealer_total) # Reveal initial hand and total

        # Dealer draws cards if total is less than DEALER_STAND_THRESHOLD
        while self.calculate_hand_total(self.dealer_hand) < DEALER_STAND_THRESHOLD:
            print("Dealer draws a card.")
            self.dealer_hand.append(self.deal_card_dealer()) # Use dealer dealing
            # No need to print the hand and total here, as it's standard to only show the final hand

        # Recalculate dealer total after drawing is complete
        dealer_total = self.calculate_hand_total(self.dealer_hand)

        print("Dealer's final hand:", self.dealer_hand, "Total:", dealer_total) # Show final hand and total

        if dealer_total > BLACKJACK_THRESHOLD:
            print("Dealer busts!")
            self.handle_win()
        elif player_total > dealer_total:
            self.handle_win()
        elif player_total < dealer_total:
            self.handle_loss()
        else:
            self.handle_draw()

    def show_stats(self):
        print(f"Money: {self.money}")
        print(f"Current streak: {self.streak}")
        print(f"Longest streak: {self.longest_streak}")
        print(f"Streak Saver owned: {self.has_streak_saver}")
        print(f"Stats: Wins={self.wins}, Losses={self.losses}, Draws={self.draws}")
        print(f"Family Status: {'Alive' if self.family_alive else 'Lost'}")

    def show_shop(self):
        print("Shop:")
        if self.has_streak_saver:
            print(f" - Streak Saver (owned)")
        else:
            print(f" - Streak Saver - {STREAK_SAVER_PRICE}")
        print(f'Type "buy streak saver" to purchase, if you have enough money.')

    def buy_item(self, item_name):
        if item_name == "streak saver":
            if self.has_streak_saver:
                print("You already own the Streak Saver.")
            elif self.money >= STREAK_SAVER_PRICE:
                self.money -= STREAK_SAVER_PRICE
                self.has_streak_saver = True
                print("Purchased Streak Saver! Your streak will now be preserved after losses.")
            else:
                print(f"Not enough money to buy Streak Saver. You need {STREAK_SAVER_PRICE}, but have {self.money}.")
        else:
            print(f"Unknown item: {item_name}")

    def work(self):
        if not self.family_alive:
            print("Your family is gone. Working won't bring them back...")
            return

        current_time = time.time()
        time_since_last_work = current_time - self.last_work_time

        if time_since_last_work >= WORK_COOLDOWN_SECONDS:
            self.money += WORK_PAYOUT
            self.last_work_time = current_time
            print(f"You worked and earned {WORK_PAYOUT} money!")
            print(f"Your new balance is: {self.money}")
            print(f"You can work again in {WORK_COOLDOWN_SECONDS} seconds.")
        else:
            remaining_cooldown = WORK_COOLDOWN_SECONDS - time_since_last_work
            print(f"You need to wait before working again. Time remaining: {remaining_cooldown:.1f} seconds.")

    def check_bills(self):
        if not self.family_alive:
            return

        current_time = time.time()
        time_since_last_bill = current_time - self.last_bill_time

        if time_since_last_bill >= BILL_FREQUENCY_SECONDS:
            print("\n--- BILLS ARE DUE! ---")
            print(f"Your family's bills are {BILL_AMOUNT} money.")

            if self.money >= BILL_AMOUNT:
                self.money -= BILL_AMOUNT
                self.last_bill_time = current_time # Update the last bill time
                print(f"You paid the bills. Your family is safe for now.")
                print(f"Your new balance is: {self.money}")
            else:
                self.family_alive = False
                print(f"You do not have enough money ({self.money}) to pay the bills ({BILL_AMOUNT}).")
                print("Your family... is gone.")
                print("Game Over.")
                self.is_started = False # End any ongoing game

    def pay_bills(self):
        if not self.family_alive:
            print("Your family is gone. There are no bills to pay.")
            return

        current_time = time.time()
        time_since_last_bill = current_time - self.last_bill_time

        if time_since_last_bill < BILL_FREQUENCY_SECONDS:
             print(f"Bills are not due yet. Time until next bill: {BILL_FREQUENCY_SECONDS - time_since_last_bill:.1f} seconds.")
             return

        # If bills are due, the check_bills in the main loop will handle the payment/consequences.
        # This function primarily tells the player when bills are due or not.
        print("Bills are due now. Your balance will be checked.")

# --- Save System Functions (Using the game instance) ---
def encode_state(game_instance):
    state = game_instance.get_state()
    json_str = json.dumps(state)
    key = 23
    obfuscated = ''.join(chr(ord(c) ^ key) for c in json_str)
    encoded = obfuscated[::-1]
    print("Your save code:", encoded)
    return encoded

def load_state(game_instance, code):
    try:
        obfuscated = code[::-1]
        key = 23
        json_str = ''.join(chr(ord(c) ^ key) for c in obfuscated)
        state = json.loads(json_str)
        game_instance.load_state(state) # Load state into the game instance
    except json.JSONDecodeError:
        print("Failed to load save: Invalid JSON format.")
    except Exception as e:
        print(f"Failed to load save: An unexpected error occurred: {e}")

def display_help():
    print("Available commands:")
    print(" p               - Play a new game")
    print(" h               - Hit (take another card)")
    print(" s               - Stand (end turn)")
    print(" work            - Earn money (with a cooldown)")
    print(" pay bills       - Manually attempt to pay bills (if due)")
    print(" restart         - Restart the game (resets all progress)")
    print(" save            - Save your game")
    print(" load <code>     - Load a game from a save code")
    print(" stats           - Display game stats")
    print(" shop            - View shop items")
    print(" buy streak saver - Purchase the Streak Saver for 1500")
    print(" e               - Exit the game")
    print(" help            - Display this help message")

# --- Main loop ---
print("Welcome to the Blackjack game!")
display_help()

game = BlackjackGame() # Create a single instance of the game

# Check bills immediately on startup (using the instance)
game.check_bills()

while True:
    # Check bills before processing the command
    game.check_bills()

    if not game.family_alive:
         valid_commands_after_loss = ['save', 'load', 'stats', 'e', 'help', 'restart']
         command = input("\nYour family is gone. Enter a command (save, load, stats, help, e, restart): ").strip().lower()
         if command not in valid_commands_after_loss and not command.startswith("load "):
              print("Your family is gone. There's nothing left to play for...")
              continue
    else:
         command = input("\nEnter a command (Enter \"help\" to display all commands): ").strip().lower()

    # Process commands using the game instance
    if command == "p":
        game.start_game()
    elif command == "h":
        game.hit()
    elif command == "s":
        game.stand()
    elif command == "work":
        game.work()
    elif command == "pay bills":
        game.pay_bills()
    elif command == "restart":
        print("\nAre you sure you want to restart the game? All progress will be lost. (y/n)")
        confirmation = input().strip().lower()
        if confirmation == 'y':
            game.reset() # Reset the game instance
            clear_screen()
            print("Game restarted!")
            display_help()
            game.check_bills() # Check bills after restart
        else:
            print("Restart cancelled.")
    elif command.startswith("load "):
        code = command[len("load "):].strip()
        if code:
            load_state(game, code) # Pass the game instance
        else:
            print("Usage: load <code>")
    elif command == "save":
        encode_state(game) # Pass the game instance
    elif command == "stats":
        game.show_stats()
    elif command == "shop":
        game.show_shop()
    elif command.startswith("buy "):
        item_parts = command.split(maxsplit=1)
        if len(item_parts) == 2:
            item_name = item_parts[1].strip()
            game.buy_item(item_name)
        else:
            print("Usage: buy <item_name>")
    elif command == "help":
        display_help()
    elif command == "e":
        print("Thanks for playing! Goodbye.")
        break
    elif command == "":
        continue
    elif command == "givemoney":
        game.give_money()
    else:
        print("Unknown command. Type 'help' to see available commands.")