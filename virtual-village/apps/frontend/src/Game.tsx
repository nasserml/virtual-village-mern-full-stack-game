import React, { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions for WebSocket messages and user data
interface SpawnPoint {
  x: number;
  y: number;
}

interface User {
  userId: string;
  x: number;
  y: number;
  type: 'Admin' | 'user';
}

type WebSocketMessageType = 
  | 'space-joined' 
  | 'user-joined' 
  | 'user-left' 
  | 'movement'
  | 'movement-rejected';

interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: {
    users?: User[];
    spawn?: SpawnPoint;
    userId?: string;
    x?: number;
    y?: number;
  };
}

// interface JoinPayload {
//   spaceId: string;
//   token: string;
// }

const ArenaPage: React.FC = () => {
  // State for WebSocket connection
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<SpawnPoint | null>(null);

  // Canvas and drawing references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Parse URL parameters
  const getUrlParam = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const token = getUrlParam('token');
  const spaceId = getUrlParam('spaceId');

  // Setup WebSocket connection
  useEffect(() => {
    if (!token || !spaceId) {
      console.error('Token or SpaceId missing');
      return;
    }

    // WebSocket connection
    const websocket = new WebSocket('ws://localhost:3001');

    websocket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);

      // Join space
      websocket.send(JSON.stringify({
        type: 'join',
        payload: { spaceId, token }
      }));
    };

    websocket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    websocket.onclose = () => {
      setIsConnected(false);
    };

    setWs(websocket);

    // Cleanup
    return () => {
      websocket.close();
    };
  }, [token, spaceId]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 2000;
    canvas.height = 2000;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    // Draw grid
    if (context) drawGrid(context);
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'space-joined':
        setUsers(message.payload.users || []);
        if (message.payload.spawn) {
          setCurrentUser({
            x: message.payload.spawn.x,
            y: message.payload.spawn.y
          });
        }
        break;
      case 'user-joined':
        if (message.payload.userId) {
          setUsers(prev => [...prev, message.payload as User]);
        }
        break;
      case 'user-left':
        if (message.payload.userId) {
          setUsers(prev => prev.filter(user => user.userId !== message.payload.userId));
        }
        break;
      case 'movement':
        updateUserPosition(message.payload);
        break;
    }
  }, []);

  // Update user position
  const updateUserPosition = useCallback((movementPayload: WebSocketMessage['payload']) => {
    if (movementPayload.userId && movementPayload.x !== undefined && movementPayload.y !== undefined) {
      setUsers(prev => prev.map(user => 
        user.userId === movementPayload.userId 
          ? { ...user, x: movementPayload.x!, y: movementPayload.y! } 
          : user
      ));
    }
  }, []);

  // Draw grid on canvas
  const drawGrid = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 1;

    for (let x = 0; x <= 2000; x += 50) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, 2000);
      context.stroke();
    }

    for (let y = 0; y <= 2000; y += 50) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(2000, y);
      context.stroke();
    }
  };

  // Handle user movement
  const handleMove = useCallback((direction: string) => {
      if (!ws || !currentUser) return;
      
      let newX = currentUser.x;
      let newY = currentUser.y;
      console.log(direction);
      console.log("=============", newX, newY);
      
      switch(direction) {
          case 'ArrowUp': newY -= 1; break;
          case 'ArrowDown': newY += 1; break;
          case 'ArrowLeft': newX -= 1; break;
          case 'ArrowRight': newX += 1; break;
        }

      console.log("=====after========", newX, newY);

        
    ws.send(JSON.stringify({
      type: 'move',
      payload: { x: newX, y: newY }
    }));
  }, [ws, currentUser]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleMove(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Render users on canvas
  useEffect(() => {

    const context = contextRef.current;
    if (!context) return;


    context.clearRect(0, 0, 2000, 2000);
    drawGrid(context);

    // Draw each user
    users.forEach(user => {
      context.fillStyle = user.type === 'Admin' ? 'blue' : 'green';
      context.beginPath();
      context.arc(
        user.x * 50 + 25,  // Center x
        user.y * 50 + 25,  // Center y
        20,  // Radius
        0,   // Start angle
        Math.PI * 2  // End angle
      );
      context.fill();
    });
  }, [users]);

  return (
    <div className="p-0">
      <p className="text-sm mb-0">Arena Space</p>
      <div className="mb-1 text-sm">
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <p>Use Arrow Keys to Move</p>
        <p>SpaceId : {spaceId}</p>
        <p>Token : {token}</p>
      </div>
      <canvas 
        ref={canvasRef} 
        className="border-2 border-gray-300"
        tabIndex={0}  // Allow canvas to receive keyboard focus
      />
    </div>
  );
};

export default ArenaPage;