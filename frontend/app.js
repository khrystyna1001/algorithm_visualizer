class AlgorithmVisualizer {
    constructor() {
        this.algorithmData = null;
        this.currentStep = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.speed = 1000;
        
        this.initializeEventListeners();
        this.setupGraph();
    }
    
    initializeEventListeners() {
        document.getElementById('loadBtn').addEventListener('click', () => this.loadAlgorithm());
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('stepBtn').addEventListener('click', () => this.stepForward());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = `${this.speed}ms`;
            if (this.isPlaying) {
                this.stopPlay();
                this.startPlay();
            }
        });
    }
    
    async loadAlgorithm() {
        try {
            const response = await axios.get('http://localhost:5001/dijkstra');
            
            // Ensure we have an object (handles potential double-stringification)
            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            
            // Safety Check: Verify required properties exist
            if (!data || !data.steps || !data.graph) {
                throw new Error("Missing 'steps' or 'graph' in server response.");
            }

            this.algorithmData = data;
            this.currentStep = 0;
            
            this.enableControls();
            
            // 1. Draw the graph first so SVG elements exist in the DOM
            this.renderGraph();
            
            // 2. Update the UI state
            this.updateVisualization();

        } catch (error) {
            console.error('Error loading algorithm:', error);
            alert('Error: ' + error.message);
        }
    }
    
    enableControls() {
        document.getElementById('playBtn').disabled = false;
        document.getElementById('stepBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
    }
    
    setupGraph() {
        const svg = document.getElementById('graph');
        if (svg) svg.setAttribute('viewBox', '0 0 600 400');
    }
    
    renderGraph() {
        const svg = document.getElementById('graph');
        if (!svg) return;
        svg.innerHTML = '';
        
        const { graph } = this.algorithmData;
        const nodes = Object.keys(graph);
        const nodePositions = this.calculateNodePositions(nodes);
        
        this.drawEdges(svg, graph, nodePositions);
        this.drawNodes(svg, nodePositions);
    }
    
    calculateNodePositions(nodes) {
        const positions = {};
        const centerX = 300;
        const centerY = 200;
        const radius = 140;
        
        nodes.forEach((node, index) => {
            const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
            positions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
        
        return positions;
    }
    
    drawEdges(svg, graph, positions) {
        const drawnEdges = new Set();
        
        Object.entries(graph).forEach(([from, edges]) => {
            Object.entries(edges).forEach(([to, weight]) => {
                const edgeKey = [from, to].sort().join('-');
                if (!drawnEdges.has(edgeKey)) {
                    drawnEdges.add(edgeKey);
                    
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', positions[from].x);
                    line.setAttribute('y1', positions[from].y);
                    line.setAttribute('x2', positions[to].x);
                    line.setAttribute('y2', positions[to].y);
                    line.setAttribute('stroke', '#9ca3af');
                    line.setAttribute('stroke-width', '2');
                    line.classList.add('edge');
                    line.setAttribute('data-edge', edgeKey);
                    
                    svg.appendChild(line);
                    
                    const midX = (positions[from].x + positions[to].x) / 2;
                    const midY = (positions[from].y + positions[to].y) / 2;
                    
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', midX);
                    text.setAttribute('y', midY - 5);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('fill', '#374151');
                    text.setAttribute('font-size', '14');
                    text.textContent = weight;
                    
                    svg.appendChild(text);
                }
            });
        });
    }
    
    drawNodes(svg, positions) {
        Object.entries(positions).forEach(([node, pos]) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', '20');
            circle.setAttribute('fill', '#ffffff');
            circle.setAttribute('stroke', '#4b5563');
            circle.setAttribute('stroke-width', '2');
            circle.classList.add('node-circle');
            circle.setAttribute('data-node', node);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = node;
            
            g.appendChild(circle);
            g.appendChild(text);
            svg.appendChild(g);
        });
    }
    
    updateStepInfo() {
        const stepInfo = document.getElementById('stepInfo');
        if (!this.algorithmData || !this.algorithmData.steps) return;

        if (this.currentStep >= this.algorithmData.steps.length) {
            stepInfo.innerHTML = '<strong>Algorithm Complete!</strong>';
            return;
        }
        
        const step = this.algorithmData.steps[this.currentStep];
        stepInfo.innerHTML = `
            <div><strong>Exploring:</strong> ${step.current}</div>
            <div><strong>Visited:</strong> ${step.visited.length > 0 ? step.visited.join(', ') : 'None'}</div>
            <div><strong>Progress:</strong> Step ${this.currentStep + 1} / ${this.algorithmData.steps.length}</div>
        `;
    }
    
    updateDistances() {
        const distancesDiv = document.getElementById('distances');
        if (!this.algorithmData) return;
        
        // Pick distances from current step or final results
        const distances = (this.currentStep < this.algorithmData.steps.length) 
            ? this.algorithmData.steps[this.currentStep].distances 
            : this.algorithmData.final_distances;
        
        if (!distances) return;

        distancesDiv.innerHTML = Object.entries(distances)
            .map(([node, dist]) => `<div>${node}: ${dist === Infinity || dist === null ? '∞' : dist}</div>`)
            .join('');
    }
    
    updatePath() {
        const pathDiv = document.getElementById('path');
        if (!this.algorithmData) return;
        
        // Only show path when algorithm is finished
        if (this.currentStep < this.algorithmData.steps.length) {
            pathDiv.innerHTML = 'Calculating...';
            return;
        }
        
        if (this.algorithmData.shortest_path) {
            pathDiv.innerHTML = this.algorithmData.shortest_path.join(' → ');
        }
    }
    
    updateVisualization() {
        if (!this.algorithmData) return;
        
        // Reset all styles
        document.querySelectorAll('.node-circle').forEach(node => {
            node.setAttribute('fill', '#ffffff');
            node.setAttribute('stroke', '#4b5563');
        });

        const steps = this.algorithmData.steps;
        
        if (this.currentStep < steps.length) {
            const step = steps[this.currentStep];
            
            // Highlight visited nodes
            step.visited.forEach(nodeName => {
                const nodeEl = document.querySelector(`circle[data-node="${nodeName}"]`);
                if (nodeEl) nodeEl.setAttribute('fill', '#d1fae5'); // Light green
            });

            // Highlight current node
            const currentEl = document.querySelector(`circle[data-node="${step.current}"]`);
            if (currentEl) {
                currentEl.setAttribute('fill', '#3b82f6'); // Blue
                currentEl.setAttribute('stroke', '#1d4ed8');
            }
        } else {
            // Highlight final path
            this.algorithmData.shortest_path.forEach(nodeName => {
                const nodeEl = document.querySelector(`circle[data-node="${nodeName}"]`);
                if (nodeEl) {
                    nodeEl.setAttribute('fill', '#fcd34d'); // Gold/Yellow
                    nodeEl.setAttribute('stroke', '#b45309');
                }
            });
        }
        
        this.updateStepInfo();
        this.updateDistances();
        this.updatePath();
    }
    
    stepForward() {
        if (!this.algorithmData) return;
        if (this.currentStep <= this.algorithmData.steps.length) {
            this.currentStep++;
            this.updateVisualization();
        }
    }
    
    togglePlay() {
        this.isPlaying ? this.stopPlay() : this.startPlay();
    }
    
    startPlay() {
        if (!this.algorithmData) return;
        this.isPlaying = true;
        document.getElementById('playBtn').textContent = 'Pause';
        
        this.playInterval = setInterval(() => {
            if (this.currentStep >= this.algorithmData.steps.length) {
                this.stopPlay();
                return;
            }
            this.stepForward();
        }, this.speed);
    }
    
    stopPlay() {
        this.isPlaying = false;
        document.getElementById('playBtn').textContent = 'Play';
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }
    
    reset() {
        this.stopPlay();
        this.currentStep = 0;
        this.updateVisualization();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmVisualizer();
});