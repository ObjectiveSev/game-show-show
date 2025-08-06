# Game Show Show - Configuration

## Team Configuration

The game is now fully configurable! You can easily update team members, names, and captains for different game sessions.

### How to Update Teams

#### Option 1: Using the Settings Modal (Recommended)
1. Open the game
2. Click on "⚙️ Configurações" in the tools section
3. Edit team names, captains, and members directly in the interface
4. Click "💾 Salvar Configuração" to save changes

#### Option 2: Edit the JSON File
1. Open `config/teams.json`
2. Update the team information:
   - `name`: Team name
   - `captain`: Team captain
   - `members`: Array of team member names
   - `color`: Team color (hex code)
   - `gradient`: CSS gradient for team styling

### Example Configuration

```json
{
  "teams": {
    "teamA": {
      "id": "A",
      "name": "Os Vencedores",
      "captain": "João",
      "members": ["João", "Maria", "Pedro", "Ana"],
      "color": "#ff6b6b",
      "gradient": "linear-gradient(145deg, #ff6b6b, #ee5a52)"
    },
    "teamB": {
      "id": "B",
      "name": "Os Campeões", 
      "captain": "Carlos",
      "members": ["Carlos", "Lucia", "Roberto", "Fernanda"],
      "color": "#4ecdc4",
      "gradient": "linear-gradient(145deg, #4ecdc4, #44a08d)"
    }
  }
}
```

### Settings

- `defaultPoints`: Default points awarded per correct answer
- `maxScore`: Maximum score limit (optional)
- `enableSound`: Enable/disable sound effects
- `enableAnimations`: Enable/disable animations

### Tips

- Team colors should be hex codes (e.g., "#ff6b6b")
- Gradients should be valid CSS gradient strings
- Member names should be unique within each team
- The configuration is automatically saved to localStorage
- You can reset to default configuration using the "🔄 Recarregar Configuração" button

### For Different Game Sessions

Simply update the `members` array in the JSON file or use the settings modal to change players for each new game session. The configuration will persist between sessions. 