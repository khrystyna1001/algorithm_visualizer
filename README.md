# Algorithm Visualizer

A web-based algorithm visualization tool with interactive GUI for understanding how algorithms work step-by-step.

## Features

- **Interactive Dijkstra's Algorithm Visualization**
- **Step-by-step execution** with play/pause controls
- **Adjustable animation speed**
- **Real-time distance updates**
- **Shortest path highlighting**
- **Modern, responsive UI**

## Setup

### Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python src/app.py
```

### Frontend
Open `frontend/index.html` in your browser or serve with a web server:
```bash
cd frontend
python -m http.server 8000
```

Then visit `http://localhost:8000`

## Usage

1. Start the Flask backend (runs on localhost:5000)
2. Open the frontend in your browser
3. Click "Load Algorithm" to load Dijkstra's algorithm
4. Use controls to:
   - **Play**: Automatic step-by-step execution
   - **Step Forward**: Manual step advancement
   - **Reset**: Return to initial state
   - **Speed Slider**: Adjust animation speed

## Algorithm Details

The visualizer demonstrates Dijkstra's shortest path algorithm on a sample graph:
- Nodes: A, B, C, D, E
- Start: A
- End: E
- Shows distance updates and visited nodes at each step

## Tech Stack

- **Backend**: Flask, Flask-API
- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Visualization**: SVG graphics
- **HTTP Client**: Axios