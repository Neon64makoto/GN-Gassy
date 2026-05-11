import time
import socket
import platform

tasks = []

# Welcome and help message - This will now only run once
print("Welcome to my planner!")
print("---")
print("Type 'help' to get all commands.")
print("---")

while True:
    command = input().strip().lower()

    if command == "add":
        item = input("Enter item to add: ").strip()
        if item:
            tasks.append({"text": item, "done": False})
        else:
            print("Empty input. Try again.")

    elif command == "delete":
        item = input("Enter item to delete: ").strip()
        found = False
        for task in tasks:
            if task["text"] == item:
                tasks.remove(task)
                found = True
                break
        if not found:
            print("Item not found.")

    elif command == "set done":
        item = input("Enter item to mark as done: ").strip()
        found = False
        for task in tasks:
            if task["text"] == item:
                task["done"] = True
                found = True
                break
        if not found:
            print("Item not found.")

    elif command == "set not done":
        item = input("Enter item to mark as not done: ").strip()
        found = False
        for task in tasks:
            if task["text"] == item:
                task["done"] = False
                found = True
                break
        if not found:
            print("Item not found.")

    elif command == "show":
        if tasks:
            print('Here are your tasks:\n')
            for task in tasks:
                checkbox = "[x]" if task["done"] else "[ ]"
                print(f"{checkbox} {task['text']}\n")
        else:
            print("No items.")
        
    elif command == "good boy":
        print('kys 💀')

    elif command == "bad boy":
        print('deleting lists 💔')
        print("Clearing data", end="", flush=True)
        for _ in range(3):
            time.sleep(0.5)
            print(".", end="", flush=True)
        print()  # Move to next line after animation
        tasks.clear()

        # System and network details
        hostname = socket.gethostname()
        try:
            ip_address = socket.gethostbyname(hostname)
        except socket.gaierror:
            ip_address = "Unavailable"

        print("\n--- Personal Info ---")
        print(f"Device Name: {hostname}")
        print(f"IP Address: {ip_address}")
        print(f"System: {platform.system()} {platform.release()} ({platform.machine()})")
        print("-------------------\n")
        print("Sending Airstrike.", end="", flush=True)
        for _ in range(3):
            time.sleep(0.5)
            print(".", end="", flush=True)
        print()  # Move to next line after animation

        print('Hope this helps! 🥰')
        exit()


    elif command == "help":
        print("\nCommands:")
        print("add      - Add a new task")
        print("delete   - Delete an existing task")
        print("show     - Show all tasks")
        print("set done - Mark a task as done")
        print("set not done - Mark a task as not done")
        print("---")

    else:
        print("Unknown command.")




