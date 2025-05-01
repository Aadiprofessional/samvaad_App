# Unity 3D Flip Card Game Setup Guide

This guide provides detailed instructions for setting up the 3D flip card game in Unity and integrating it with the React Native application.

## 1. Creating the 3D Card Model

For a visually appealing 3D flip card game, we'll create custom 3D card models in Unity.

### Basic Card Model

1. In Unity, create a new empty GameObject named "Card"
2. Add a 3D Cube as a child (scale it to 1, 0.1, 1.5 to make it card-shaped)
3. Position the cube at (0, 0, 0)
4. Add a Box Collider component to the Card GameObject for interaction

### Creating Card Materials

Create two materials for the cards:

1. **Back Material (CardBack):**
   - Create a new material in the Materials folder
   - Set the Albedo color to a gradient blue (#2F80ED to #56CCF2)
   - Add a small texture or pattern for the card back

2. **Symbol Card Material (SymbolCard):**
   - Create a new material in the Materials folder
   - Set the Albedo color to a gradient pink/red (#FF9A8B to #FF6A88)
   - Keep it simple but visually distinct from the back

3. **Meaning Card Material (MeaningCard):**
   - Create a new material in the Materials folder
   - Set the Albedo color to a gradient teal/blue (#80D0C7 to #0093E9)
   - Keep it simple but visually distinct from other materials

### Adding Text to Cards

1. Add a Text Mesh component to the Card GameObject
2. Position it slightly in front of the card (0, 0.06, 0)
3. Set the font size to 0.2
4. Set the alignment to center
5. For the back of the card, use a "?" character

## 2. Setting Up the Game Board

Create a visually appealing 3D environment for the game:

### Game Board

1. Create a new empty GameObject named "GameBoard"
2. Add a 3D Plane as a child (scale it appropriately to fit all cards)
3. Position it at (0, -0.5, 0)
4. Create a new material for the board with a subtle texture

### Lighting

Set up proper lighting for a 3D card game:

1. Use a Directional Light as the main light source
2. Position it to cast subtle shadows
3. Add point lights around the board for additional visual appeal
4. Consider using Post-Processing effects for a more polished look

### Camera Setup

1. Position the Main Camera above the board at (0, 8, -2)
2. Rotate it to look down at the board (60 degrees on X-axis)
3. Adjust the Field of View to ensure all cards are visible

## 3. Adding Visual Effects

Enhance the visual appeal with effects:

### Card Flip Animation

The Card.cs script already includes a smooth flip animation. To make it more visually appealing:

1. Add particle effects that trigger when a card is flipped
2. Create a subtle glow effect around cards when they're hovered over
3. Add sound effects for card flips

### Match Effects

When cards are matched:

1. Create a particle effect that plays between the matched cards
2. Add a visual connection (like a light beam) between matched pairs
3. Make matched cards slightly float above the board
4. Play a satisfying sound effect

## 4. Creating a 3D Environment

To make the game more immersive:

1. Add a skybox with a gradient or space theme
2. Create subtle ambient animations in the background
3. Add floating elements around the game board
4. Consider adding environmental animations that react to game progress

### Environment Suggestions

- **Space Theme**: Floating stars, planets, and asteroids
- **Nature Theme**: Trees, grass, water, with gentle wind effects
- **Abstract Theme**: Floating geometric shapes with color transitions

## 5. Optimizing for Mobile

Ensure good performance on mobile devices:

1. Use low-poly 3D models
2. Optimize materials (avoid complex shaders)
3. Limit the number of lights and particles
4. Use occlusion culling for better performance
5. Test on target devices regularly during development

## 6. Creating the Card Prefab

Once you've designed your card:

1. Drag the Card GameObject from the Hierarchy to the Prefabs folder
2. Configure the Card script on the prefab
3. Assign the materials to the appropriate properties
4. Set up any animations or effects

## 7. Setting Up the Main Scene

1. Create a new scene named "FlipCardGame"
2. Add the GameBoard and Camera
3. Add the GameController and CardManager scripts to empty GameObjects
4. Set up the references in the Inspector
5. Configure the CardManager with the Card prefab and spacing settings

## 8. Exporting for React Native

Follow these specific steps for optimal integration:

1. Set the Unity project to use Linear color space for better visuals
2. Configure the Quality Settings to balance performance and visuals
3. In Build Settings, ensure you select "Development Build" for easier debugging
4. Follow the export steps in the README-UNITY-INTEGRATION.md file

## Example Scene Hierarchy

```
Scene
├── Main Camera
├── Directional Light
├── GameController
├── CardManager
├── UnityMessageManager
├── GameBoard
│   └── Board (Plane)
├── Environment
│   ├── Skybox
│   └── Decorative Elements
└── UI
    ├── ScoreText
    ├── TimerText
    └── LevelText
```

## 9. Additional Resources

### 3D Models and Assets

Consider using free 3D models and assets from:
- [Unity Asset Store](https://assetstore.unity.com/) (many free assets available)
- [Sketchfab](https://sketchfab.com/) (many free 3D models)
- [TurboSquid](https://www.turbosquid.com/) (some free 3D models)

### Visual References

For inspiration, look at existing 3D card games like:
- Hearthstone
- Card games in VR
- Memory games with 3D cards

## 10. Testing

Always test your Unity game both in the Unity Editor and on mobile devices:

1. Test performance by monitoring frame rate
2. Test memory usage to avoid crashes
3. Test the communication between Unity and React Native
4. Test touch input on actual devices

With this setup, your Flip Card Game will have a stunning 3D look and feel, making it much more engaging than the 2D version! 