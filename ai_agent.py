import os
import sys

# Check if OpenAI is installed, if not provide instructions
try:
    import openai
except ImportError:
    print("OpenAI package not found. Please install it using:")
    print("pip install openai")
    sys.exit(1)

class AIAgent:
    def __init__(self, api_key=None):
        """Initialize the AI agent with OpenAI API key."""
        # Use provided API key or get from environment variable
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        
        if not self.api_key:
            print("Error: OpenAI API key not provided.")
            print("Please set your OPENAI_API_KEY environment variable or provide it when initializing the agent.")
            sys.exit(1)
            
        # Set up the OpenAI client
        openai.api_key = self.api_key
        
        # Initialize conversation history
        self.conversation_history = [
            {"role": "system", "content": "You are a helpful AI assistant."}
        ]
    
    def ask(self, question):
        """Send a question to the AI and get a response."""
        # Add the user's question to the conversation history
        self.conversation_history.append({"role": "user", "content": question})
        
        try:
            # Call the OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-4",  # You can change this to other models like "gpt-3.5-turbo"
                messages=self.conversation_history
            )
            
            # Extract the assistant's response
            answer = response.choices[0].message.content
            
            # Add the assistant's response to the conversation history
            self.conversation_history.append({"role": "assistant", "content": answer})
            
            return answer
            
        except Exception as e:
            return f"Error: {str(e)}"
    
    def reset_conversation(self):
        """Reset the conversation history."""
        self.conversation_history = [
            {"role": "system", "content": "You are a helpful AI assistant."}
        ]
        return "Conversation has been reset."

def main():
    """Run the AI agent in interactive mode."""
    # Check for API key in environment
    api_key = os.environ.get("OPENAI_API_KEY")
    
    if not api_key:
        print("OpenAI API key not found in environment variables.")
        api_key = input("Please enter your OpenAI API key: ")
    
    # Create the AI agent
    agent = AIAgent(api_key)
    
    print("AI Agent initialized. Type 'exit' to quit or 'reset' to clear conversation history.")
    
    while True:
        # Get user input
        user_input = input("\nYou: ")
        
        # Check for exit command
        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break
        
        # Check for reset command
        if user_input.lower() == "reset":
            print(agent.reset_conversation())
            continue
        
        # Get response from the agent
        response = agent.ask(user_input)
        print(f"\nAI: {response}")

if __name__ == "__main__":
    # For demonstration purposes, we'll just print instructions
    print("To use this AI agent, you need to:")
    print("1. Set your OPENAI_API_KEY environment variable")
    print("2. Run this script with 'python ai_agent.py'")
    print("\nExample usage:")
    print("agent = AIAgent('your-api-key')")
    print("response = agent.ask('What is machine learning?')")
    print("print(response)")
    
    # Uncomment to run the interactive mode
    # main()
